import { createApp } from "./app.mjs";
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be an integer between 1 and 65535");
const { server, markShuttingDown } = createApp({
  environment: process.env.APP_ENV ?? "local",
  commit: process.env.COMMIT_SHA ?? "local",
  version: process.env.APP_VERSION ?? "1.0.0",
  drills: process.env.ENABLE_DRILLS === "true",
  allowedOrigins: (process.env.DRILL_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});
server.listen(port, process.env.HOST ?? "0.0.0.0", () =>
  console.log(JSON.stringify({ level: "info", event: "listening", port })),
);
let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  markShuttingDown();
  server.close(() => {
    process.exitCode = 0;
  });
  server.closeIdleConnections();
  setTimeout(() => server.closeAllConnections(), 10_000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
