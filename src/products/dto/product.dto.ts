import { IUserRead } from "../../users/dto/user-read.dto";

export interface IProduct {
	name: string;
	user?: IUserRead;
}
