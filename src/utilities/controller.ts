import { Request, Response } from "express";

export function controller(cb: (req: Request, res: Response) => Promise<void>) {
	return (req: Request, res: Response) => {
		cb(req, res).catch((error) => {
			if (!error) {
				res.status(500).send({ name: "ServerError", message: "server error" });
			}

			const name = error.name;
			const message = error.message;
			const stack = error.stack;
			const status = error.status;

			if (status && status >= 300 && status < 600) {
				res.status(status).send({ name, message, stack });
			} else if (name === "SequelizeUniqueConstraintError") {
				res.status(406).send({
					message,
					stack,
					errors: error.errors.map((it: any) => ({
						message: it.message,
						type: it.type,
						field: it.path,
						value: it.value,
					})),
				});
			} else {
				res
					.status(500)
					.send({ name: "ServerError", message: "server error", stack });
			}
		});
	};
}
