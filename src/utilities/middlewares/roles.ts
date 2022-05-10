import { NextFunction, Request, Response } from "express";
import { Forbidden, InternalServerError } from "http-errors";
import { EUserRole } from "../../users/dto/user.dto";
import { IUserRead } from "../../users/dto/user-read.dto";

export function roles(...roles: EUserRole[]) {
	return (req: Request, res: Response, nf: NextFunction) => {
		try {
			const user = req.user as IUserRead;
			if (!user) {
				throw new InternalServerError(
					"no se pueden comprobar roles sin session del usuario"
				);
			}

			if (![EUserRole.ADMIN, ...roles].includes(user.role)) {
				throw new Forbidden("Access Denied");
			}

			nf();
		} catch (e: any) {
			res
				.status(e.status)
				.send({ name: e.name, message: e.message, stack: e.stack });
		}
	};
}
