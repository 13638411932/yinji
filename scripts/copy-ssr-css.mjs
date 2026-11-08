#!/usr/bin/env node
/**
 * TanStack Start emits a different CSS hash in the SSR bundle than in
 * .output/public. Point SSR hrefs at the public stylesheet so node-server
 * does not 404 the stylesheet.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const indexPath = join(root, ".output/server/index.mjs");
const serverDir = join(root, ".output/server");
if (!existsSync(indexPath) || !existsSync(serverDir)) process.exit(0);

const index = readFileSync(indexPath, "utf8");
const mapped = [...index.matchAll(/"(\/assets\/styles-[^"]+\.css)"/g)].map((m) => m[1]);
const canonical = mapped[0];
if (!canonical) process.exit(0);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!name.endsWith(".mjs")) continue;
    const src = readFileSync(path, "utf8");
    const next = src.replace(/\/assets\/styles-[A-Za-z0-9_-]+\.css/g, canonical);
    if (next !== src) writeFileSync(path, next);
  }
}

walk(serverDir);
