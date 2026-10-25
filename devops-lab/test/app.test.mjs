import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { createApp } from "../server/app.mjs";
async function fixture(t, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), "learnops-"));
  await writeFile(join(dir, "index.html"), '<div id="root"></div>');
  const app = createApp({ staticDir: dir, log: () => {}, ...options });
  app.server.listen(0, "127.0.0.1");
  await once(app.server, "listening");
  t.after(async () => {
    app.server.closeAllConnections();
    await new Promise((resolve) => app.server.close(resolve));
    await rm(dir, { recursive: true });
  });
  const base = "http://127.0.0.1:" + app.server.address().port;
  return { ...app, request: (path, init) => fetch(base + path, init) };
}
test("readiness can fail while liveness stays healthy; recovery restores probes", async (t) => {
  const app = await fixture(t, { drills: true });
  assert.equal(
    (await app.request("/api/probe", { method: "POST" })).status,
    200,
  );
  const drill = await app.request("/api/drills/readiness", {
    method: "POST",
    body: JSON.stringify({ degraded: true }),
  });
  assert.equal(drill.status, 200);
  assert.equal((await app.request("/health/ready")).status, 503);
  assert.equal((await app.request("/health/live")).status, 200);
  assert.equal(
    (await app.request("/api/probe", { method: "POST" })).status,
    503,
  );
  await app.request("/api/drills/readiness", {
    method: "POST",
    body: JSON.stringify({ degraded: false }),
  });
  assert.equal(
    (await app.request("/api/probe", { method: "POST" })).status,
    200,
  );
  const metrics = await (await app.request("/api/metrics")).json();
  assert.equal(metrics.probeRequests, 3);
  assert.equal(metrics.probeErrors, 1);
  assert.equal(metrics.events[0].type, "service_recovered");
});
test("drills default to disabled and reject cross-origin requests", async (t) => {
  const app = await fixture(t);
  assert.equal(
    (
      await app.request("/api/drills/readiness", {
        method: "POST",
        body: '{"degraded":true}',
      })
    ).status,
    403,
  );
  const local = await fixture(t, { drills: true });
  assert.equal(
    (
      await local.request("/api/drills/readiness", {
        method: "POST",
        headers: { Origin: "https://untrusted.example" },
        body: '{"degraded":true}',
      })
    ).status,
    403,
  );
  assert.equal((await local.request("/health/ready")).status, 200);
});
test("invalid and oversized drill inputs cannot change readiness", async (t) => {
  const app = await fixture(t, { drills: true });
  for (const body of ["invalid", "{}", '{"degraded":"yes"}'])
    assert.equal(
      (await app.request("/api/drills/readiness", { method: "POST", body }))
        .status,
      400,
    );
  assert.equal(
    (
      await app.request("/api/drills/readiness", {
        method: "POST",
        body: "x".repeat(1200),
      })
    ).status,
    413,
  );
  assert.equal((await app.request("/health/ready")).status, 200);
});
test("serves built UI with headers, rejects traversal and unknown API endpoints", async (t) => {
  const app = await fixture(t);
  const page = await app.request("/");
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type"), /text\/html/);
  assert.equal(page.headers.get("x-content-type-options"), "nosniff");
  assert.ok(page.headers.get("x-request-id"));
  assert.equal((await app.request("/%2e%2e%2fsecret")).status, 403);
  assert.equal((await app.request("/api/missing")).status, 404);
  assert.equal((await app.request("/missing.js")).status, 404);
});
test("shutdown makes readiness fail and exposes build metadata without environment secrets", async (t) => {
  const app = await fixture(t, { environment: "test", commit: "abc123" });
  app.markShuttingDown();
  assert.equal((await app.request("/health/ready")).status, 503);
  assert.equal((await app.request("/health/live")).status, 200);
  const status = await (await app.request("/api/status")).json();
  assert.equal(status.commit, "abc123");
  assert.equal(status.environment, "test");
  assert.equal(status.ready, false);
  assert.equal(status.drillsEnabled, false);
  assert.equal(Object.hasOwn(status, "AWS_SECRET_ACCESS_KEY"), false);
});

test("an explicitly allowed development proxy origin can run a local drill", async (t) => {
  const app = await fixture(t, {
    drills: true,
    allowedOrigins: ["http://localhost:4173"],
  });
  const response = await app.request("/api/drills/readiness", {
    method: "POST",
    headers: { Origin: "http://localhost:4173" },
    body: '{"degraded":true}',
  });
  assert.equal(response.status, 200);
  assert.equal((await app.request("/health/ready")).status, 503);
});
