import { NextFunction, Response } from "express";
import { Request } from "../request";
import { IPagination } from "../types/pagination";

export function pagination(req: Request, res: Response, nf: NextFunction) {
	if (req.query.pagination) {
		const _pagination: any = req.query.pagination;
		const pagination: IPagination =
			typeof _pagination === "string" ? JSON.parse(_pagination) : _pagination;

		req.pagination = {
			limit: +pagination.perPage,
			offset: (+pagination.page - 1) * +pagination.perPage,
		};
	}

	nf();
}
