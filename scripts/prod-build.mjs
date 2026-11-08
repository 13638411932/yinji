#!/usr/bin/env node
/**
 * Production build:
 * - Grok / Vercel → Nitro `vercel` (`.vercel/output`)
 * - Hostinger / VPS → Nitro `node-server` (`.output`)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function useNodeServer() {
  const preset = process.env.NITRO_PRESET;
  if (preset === "node-server" || preset === "node_server") return true;
  if (preset === "vercel") return false;
  if (process.env.VERCEL || process.env.NOW_BUILDER) return false;
  // App-builder sandbox keeps the Vercel preset for the live platform.
  if (existsSync(join(root, "AGENTS.md"))) return false;
  return true;
}

function run(args, extraEnv = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status) process.exit(result.status);
}

const nodeServer = useNodeServer();
console.log(`[prod-build] nitro preset: ${nodeServer ? "node-server" : "vercel"}`);

if (nodeServer) {
  run(["scripts/with-app-env.mjs", "vite", "build"], {
    NITRO_PRESET: "node-server",
    VITE_AUTH_ENABLED: "false",
  });
  run(["scripts/copy-ssr-css.mjs"]);
  if (!existsSync(join(root, ".output/server/index.mjs"))) {
    console.error("[prod-build] expected .output/server/index.mjs after node-server build");
    process.exit(1);
  }
} else {
  run(["scripts/with-app-env.mjs", "vite", "build"]);
  run(["scripts/with-app-env.mjs", "npm", "run", "db:migrate"]);
}
