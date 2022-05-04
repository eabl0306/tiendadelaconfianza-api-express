import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { IUserRead } from "../dto/user-read.dto";
import { IUserCreate } from "../dto/user-create.dto";

export class UserModel
	extends Model<IUserRead, IUserCreate>
	implements IUserRead
{
	declare id: number;
	declare email: string;
	declare first_name: string;
	declare last_name: string;
	declare password: string;
	declare created_at: Date;
	declare updated_at: Date;
	declare deleted_at: Date;
}

UserModel.init(
	{
		id: {
			type: DataTypes.BIGINT,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		first_name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		deleted_at: {
			type: DataTypes.DATE,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

UserModel.sync({ alter: true }).then();
