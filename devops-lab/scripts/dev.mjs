import { spawn } from "node:child_process";
const children = [
  spawn(process.execPath, ["--watch", "server/index.mjs"], {
    stdio: "inherit",
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: "3000",
      ENABLE_DRILLS: "true",
      APP_ENV: "local",
      DRILL_ALLOWED_ORIGINS:
        "http://localhost:4173,http://127.0.0.1:4173,http://terminal.local:4173",
    },
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js"], {
    stdio: "inherit",
  }),
];
let closing = false;
function stop(code = 0) {
  if (closing) return;
  closing = true;
  process.exitCode = code;
  children.forEach((child) => child.kill("SIGTERM"));
}
children.forEach((child) => {
  child.on("exit", (code) => stop(code ?? 0));
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
});
process.on("SIGTERM", () => stop());
process.on("SIGINT", () => stop());
