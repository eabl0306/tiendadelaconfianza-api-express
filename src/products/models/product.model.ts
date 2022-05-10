import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { UserModel } from "../../users/models/user.model";
import { IProductRead } from "../dto/product-read.dto";
import { IProductCreate } from "../dto/product-create.dto";
import { IUserRead } from "../../users/dto/user-read.dto";
import Sync from "../../utilities/syncDB";

export class ProductModel
	extends Model<IProductRead, IProductCreate>
	implements IProductRead
{
	declare id: number;
	declare user_id: number;
	declare user: IUserRead;
	declare name: string;
	declare created_at: Date;
	declare updated_at: Date;
	declare deleted_at: Date;
}

ProductModel.init(
	{
		id: {
			type: DataTypes.BIGINT,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
		},
		user_id: {
			type: DataTypes.BIGINT,
		},
		name: {
			type: DataTypes.STRING,
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
		tableName: "products",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

// products --> user
ProductModel.belongsTo(UserModel, {
	as: "user",
	foreignKey: "user_id",
	onDelete: "RESTRICT",
	onUpdate: "RESTRICT",
});

UserModel.hasMany(ProductModel, { as: "products", foreignKey: "user_id" });

Sync.register(ProductModel);
