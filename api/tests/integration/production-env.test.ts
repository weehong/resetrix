import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";

const API_DIR = new URL("../..", import.meta.url).pathname;

function bootWithEnv(env: NodeJS.ProcessEnv): Promise<string> {
	const base = { ...process.env };
	delete base["AUTH0_JWKS_URI"];
	delete base["AUTH0_ISSUER"];
	delete base["AUTH0_AUDIENCE"];
	return new Promise((resolve, reject) => {
		const child = spawn(
			"npx",
			[
				"tsx",
				"-e",
				`import('${API_DIR}src/app.ts').then(() => console.log('APP_BOOTED'))`,
			],
			{ env: { ...base, ...env }, cwd: API_DIR }
		);
		let stdout = "";
		let stderr = "";
		const timer = setTimeout(() => {
			child.kill("SIGTERM");
			reject(new Error(`Timed out. stdout: ${stdout} stderr: ${stderr}`));
		}, 8000);
		child.stdout.on("data", (chunk: Buffer) => {
			stdout += chunk.toString();
			if (stdout.includes("APP_BOOTED")) {
				clearTimeout(timer);
				child.kill("SIGTERM");
				resolve(stdout + stderr);
			}
		});
		child.stderr.on("data", (chunk: Buffer) => {
			stderr += chunk.toString();
		});
		child.on("error", reject);
		child.on("exit", () => {
			clearTimeout(timer);
			resolve(stdout + stderr);
		});
	});
}

describe("production boot config", () => {
	it("fails fast when Auth0 env is missing in production", async () => {
		const output = await bootWithEnv({
			NODE_ENV: "production",
			DATABASE_URL: "postgresql://localhost:5432/resetrix",
		});
		expect(output).toContain("AUTH0_JWKS_URI is required in production");
		expect(output).toContain("AUTH0_ISSUER is required in production");
		expect(output).toContain("AUTH0_AUDIENCE is required in production");
	}, 15000);
});
