import { IUser } from "./user.dto";

export interface IUserRead extends IUser {
	id: number;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}
