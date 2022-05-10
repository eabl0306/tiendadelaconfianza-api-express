export enum EUserRole {
	ADMIN = "ADMIN",
	USER = "USER",
}

export interface IUser {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: EUserRole;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}
