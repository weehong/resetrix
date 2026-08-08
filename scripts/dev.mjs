import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const services = [
  { name: "app", dir: path.join(root, "app"), cmd: "pnpm", args: ["dev"] },
  { name: "api", dir: path.join(root, "api"), cmd: "npm", args: ["run", "dev"] },
];

const children = new Map();

function start(service) {
  const child = spawn(service.cmd, service.args, {
    cwd: service.dir,
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: ["inherit", "pipe", "pipe"],
  });

  const tag = `[${service.name}]`;
  child.stdout.on("data", (d) => process.stdout.write(`${tag} ${d}`));
  child.stderr.on("data", (d) => process.stderr.write(`${tag} ${d}`));

  child.on("exit", (code, signal) => {
    console.log(`${tag} exited (code=${code ?? "null"}, signal=${signal ?? "null"})`);
    children.delete(service.name);
    stopAll(code);
  });

  children.set(service.name, child);
}

function stopAll(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children.values()) child.kill("SIGTERM");
  setTimeout(() => {
    for (const child of children.values()) {
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  }, 3000).unref();
  process.exitCode = exitCode ?? 0;
}

let shuttingDown = false;

process.on("SIGINT", () => stopAll(130));
process.on("SIGTERM", () => stopAll());

for (const service of services) start(service);
