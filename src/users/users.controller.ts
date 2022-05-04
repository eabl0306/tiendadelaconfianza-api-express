import { Request, Response } from "express";
import { IUserRead } from "./dto/user-read.dto";
import { userService } from "./users.service";

export async function get(req: Request, res: Response) {
	const user: IUserRead = await userService.findOneById(+req.params.id);
	res.status(200).json(user);
}

export async function getByEmail(req: Request, res: Response) {
	const user: IUserRead = await userService.findOneByEmail(
		`${req.params.email}`
	);
	res.status(200).json(user);
}
