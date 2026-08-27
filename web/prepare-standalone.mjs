import { cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const standaloneRoot = resolve(".next/standalone");

// Next's standalone bundle excludes static assets by design. Mirror the
// Dockerfile assembly so production browser tests exercise the real runtime.
cpSync(resolve("public"), resolve(standaloneRoot, "public"), {
	recursive: true,
});
mkdirSync(resolve(standaloneRoot, ".next"), { recursive: true });
cpSync(resolve(".next/static"), resolve(standaloneRoot, ".next/static"), {
	recursive: true,
});
