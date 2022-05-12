import { Response } from "express";
import { IUserRead } from "./dto/user-read.dto";
import { userService } from "./users.service";
import { IUserCreate } from "./dto/user-create.dto";
import { encrypt } from "../utilities/encrypt";
import { EUserRole } from "./dto/user.dto";
import { Request } from "../utilities/request";
import { UserModel } from "./models/user.model";
import { Op } from "sequelize";

export async function findOneById(req: Request, res: Response) {
	const user: IUserRead = await userService.findOneById(+req.params.id);
	res.status(200).json(user);
}

export async function findAll(req: Request<UserModel>, res: Response) {
	const users: IUserRead[] = await userService
		.findAll({
			where: { [Op.and]: [{ id: 2 }, req.queryAbilities] },
			...req.pagination,
		})
		.then((it) => it.map((it) => it.toJSON()));
	const total: number = await userService.count({
		where: { [Op.and]: [{ id: 2 }, req.queryAbilities] },
		...req.pagination,
	});
	res.status(200).json({ data: users, total });
}

export async function create(req: Request, res: Response) {
	const data = req.body as IUserCreate;

	data.role = EUserRole.USER;
	data.password = encrypt(data.password);

	const user: IUserRead = await userService
		.create(data)
		.then((it) => it.toJSON());

	delete user.password;

	res.status(200).json(user);
}
