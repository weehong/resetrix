import type { Logger } from "@/config/logger.js";
import type { AuthContext } from "@/middlewares/auth.js";
import type { User } from "@prisma/client";

// `pino-http` attaches a per-request id and child logger to the request object.
// Auth middleware attaches the verified token claims, and ensure-user attaches
// the local User projection. Augment Express's types so handlers can read them
// without casts.
declare global {
	namespace Express {
		interface Request {
			id: string;
			log: Logger;
			auth?: AuthContext;
			user?: User;
		}
	}
}

export {};
