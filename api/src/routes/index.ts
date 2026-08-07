import { Router } from "express";

import { healthRouter } from "@/routes/health.route.js";
import { meRouter } from "@/routes/me.route.js";

/**
 * Root application router. Health/readiness probes live at the top level;
 * versioned feature routes mount under `/api/v1`.
 */
export const apiRouter: Router = Router();

apiRouter.use(healthRouter);

const v1Router: Router = Router();
// Mount feature routers here, e.g. v1Router.use("/users", usersRouter);
v1Router.use(meRouter);
apiRouter.use("/api/v1", v1Router);
