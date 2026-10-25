const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
for (const path of [
  "/health/live",
  "/health/ready",
  "/api/status",
  "/api/metrics",
  "/",
]) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  if (
    path === "/" &&
    !(await response.text()).includes('<div id="root"></div>')
  )
    throw new Error("React page did not load");
  console.log(`PASS ${path}`);
}
