import { Request, Response } from "express";
import { userService } from "../users/users.service";
import { sign } from "jsonwebtoken";
import { Unauthorized } from "http-errors";

export async function authLocal(req: Request, res: Response) {
	const email: string = req.body.email;
	const password: string = req.body.password;

	const user = await userService.findOneByEmail(email);

	if (!user || password !== user.password) {
		throw new Unauthorized("Usuario o clave inconrecctos");
	}

	const jwt = sign({ sub: user.id }, process.env.JWT_SECRET);

	res.status(200).json({ jwt, user });
}

export async function profile(req: Request, res: Response) {
	res.status(200).json(req.user);
}
