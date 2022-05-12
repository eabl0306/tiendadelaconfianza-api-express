import {
	Attributes,
	CreateOptions,
	CreationAttributes,
	FindOptions,
	Model,
	ModelStatic,
	UpdateOptions,
} from "sequelize";
import { Col, Fn, Literal } from "sequelize/types/utils";
import { merge } from "./merge";

export type updateData<R, C, T extends Model<R, C>> = {
	[key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
};

export class Service<R, C, T extends Model<R, C>> {
	protected deletedField = "deleted_at";
	protected raw: boolean = false;
	protected returning: boolean = true;
	protected optionsDefault: FindOptions<T>;

	constructor(protected model: ModelStatic<T>) {
		const deleteDate: any = { [this.deletedField]: null };
		this.optionsDefault = { where: { ...deleteDate }, raw: this.raw };
	}

	create(data: CreationAttributes<T>, options?: CreateOptions<Attributes<T>>) {
		return this.model.create(data, options);
	}

	count(options?: FindOptions<T>) {
		return this.model.count(merge({}, this.optionsDefault, options));
	}

	findAll(options?: FindOptions<T>) {
		return this.model.findAll(merge({}, this.optionsDefault, options));
	}

	findOneById(id: number, options?: FindOptions<T>) {
		return this.model.findOne(
			merge({ where: { id } } as any, this.optionsDefault, options)
		);
	}

	update(
		data: updateData<R, C, T>,
		options: Omit<UpdateOptions<Attributes<T>>, "returning">
	) {
		return this.model.update<T>(data, {
			...options,
			returning: this.returning,
		});
	}

	remove(
		id: number,
		options?: Omit<UpdateOptions<Attributes<T>>, "returning">
	) {
		const deleteDate: any = { [this.deletedField]: new Date() };
		const where: any = { id };
		return this.update(deleteDate, merge({ where: { ...where } }, options));
	}
}
