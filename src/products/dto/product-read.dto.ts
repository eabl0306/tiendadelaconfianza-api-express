import { IProduct } from "./product.dto";

export interface IProductRead extends IProduct {
	id: number;
	user_id?: number;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}
