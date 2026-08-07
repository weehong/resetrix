import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";

import { HttpError } from "@/lib/http-error.js";

interface ValidationSchemas {
	readonly body?: ZodTypeAny;
	readonly query?: ZodTypeAny;
	readonly params?: ZodTypeAny;
}

/**
 * Build a middleware that validates the request `body`, `query`, and/or `params`
 * against the given zod schemas. Parsed (and coerced) values replace the raw
 * input so downstream handlers receive typed data. A failed parse becomes a 400
 * `HttpError` carrying the flattened field errors.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
	return (request: Request, _response: Response, next: NextFunction): void => {
		for (const key of ["body", "query", "params"] as const) {
			const schema = schemas[key];
			if (!schema) {
				continue;
			}

			const result = schema.safeParse(request[key]);
			if (!result.success) {
				next(
					HttpError.badRequest(`Invalid request ${key}`, result.error.flatten())
				);
				return;
			}

			if (key === "body") {
				// `req.body` is writable; replace it outright so fields stripped by
				// the schema don't survive on the request.
				request.body = result.data as unknown;
				continue;
			}

			if (key === "query") {
				// Express 5 exposes `req.query` as a prototype getter that returns a
				// fresh object. Mutating that snapshot does not persist — redefine an
				// own property so downstream handlers see the validated value.
				Object.defineProperty(request, "query", {
					configurable: true,
					enumerable: true,
					writable: false,
					value: result.data as Request["query"],
				});
				continue;
			}

			// `req.params` is still a mutable object; clear stale keys first so a
			// plain `Object.assign` cannot leave behind fields the schema removed.
			const target = request.params as Record<string, unknown>;
			for (const existing of Object.keys(target)) {
				delete target[existing];
			}
			Object.assign(target, result.data);
		}

		next();
	};
}
