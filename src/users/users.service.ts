import { Service } from "../utilities/service";
import { IUserRead } from "./dto/user-read.dto";
import { IUserCreate } from "./dto/user-create.dto";
import { UserModel } from "./models/user.model";

class UsersService extends Service<IUserRead, IUserCreate, UserModel> {
	constructor() {
		super(UserModel);
	}

	findOneByEmail(email: string) {
		return this.model.findOne({
			where: { email },
		});
	}
}

export const userService = new UsersService();
