import { NextFunction, Request, Response } from "express";

export function controller(cb: (req: Request, res: Response) => Promise<void>) {
	return (req: Request, res: Response, nf: NextFunction) => {
		cb(req, res)
			.then(() => nf())
			.catch((error) => nf(error));
	};
}
