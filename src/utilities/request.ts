import { Request as ExpressRequest } from "express";
import { WhereOptions } from "sequelize";
import { IUserRead } from "../users/dto/user-read.dto";

export interface Request<M = any> extends ExpressRequest {
	pagination?: { limit: number; offset: number };
	queryAbilities?: WhereOptions<M>;
	user?: IUserRead | undefined;
}
