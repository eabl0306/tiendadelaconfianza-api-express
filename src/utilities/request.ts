import { Request as ExpressRequest } from "express";
import { FindOptions } from "sequelize";
import { IUserRead } from "../users/dto/user-read.dto";

export interface Request<M = any> extends ExpressRequest {
	user?: IUserRead | undefined;
	conditions?: FindOptions<M>;
}
