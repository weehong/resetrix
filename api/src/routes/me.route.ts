import { Router } from "express";

import { meController } from "@/controllers/me.controller.js";
import { requireAuth, requirePermission } from "@/middlewares/auth.js";
import { ensureUser } from "@/middlewares/ensure-user.js";

export const meRouter: Router = Router();

meRouter.get(
	"/me",
	requireAuth(),
	requirePermission("read:profile"),
	ensureUser(),
	meController
);
