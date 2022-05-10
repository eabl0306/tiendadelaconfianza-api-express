import { Request, Response } from "express";
import { userService } from "../users/users.service";
import { sign } from "jsonwebtoken";
import { Unauthorized } from "http-errors";
import { compare } from "../utilities/encrypt";

export async function authLocal(req: Request, res: Response) {
	const email: string = req.body.email;
	const password: string = req.body.password;

	const user = await userService
		.findOneByEmail(email)
		.then((it) => it.toJSON());

	if (!user || !compare(password, user.password)) {
		throw new Unauthorized("Usuario o clave inconrecctos");
	}

	const jwt = sign({ sub: user.id }, process.env.JWT_SECRET);

	delete user.password;

	res.status(200).json({ jwt, user });
}

export async function profile(req: Request, res: Response) {
	res.status(200).json(req.user);
}
