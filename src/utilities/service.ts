import * as _ from "lodash";
import {
	Attributes,
	CreationAttributes,
	FindOptions,
	Model,
	ModelStatic,
	UpdateOptions,
} from "sequelize";
import { Col, Fn, Literal } from "sequelize/types/utils";

type updateData<R, C, T extends Model<R, C>> = {
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

	create(data: CreationAttributes<T>) {
		return this.model.create(data);
	}

	count(options?: FindOptions<T>) {
		return this.model.count(_.merge(this.optionsDefault, options));
	}

	findAll(options?: FindOptions<T>) {
		return this.model.findAll(_.merge(this.optionsDefault, options));
	}

	findOneById(id: number, options?: FindOptions<T>) {
		return this.model.findOne(
			_.merge({ where: { id } }, this.optionsDefault, options)
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

	remove(id: number) {
		const deleteDate: any = { [this.deletedField]: new Date() };
		const where: any = { id };
		return this.update(deleteDate, { where: { ...where } });
	}
}
