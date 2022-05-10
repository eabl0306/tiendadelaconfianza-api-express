import { ModelStatic } from "sequelize";

class Sync {
	public static models: ModelStatic<any>[] = [];

	public static register(model: ModelStatic<any>) {
		Sync.models.push(model);
	}

	public static async synchronize() {
		for (let i = 0; i < Sync.models.length; i++) {
			await Sync.models[i].sync({ alter: true });
		}
	}
}

export default Sync;
