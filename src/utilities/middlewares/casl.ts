import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Rule } from "@casl/ability/dist/types/Rule";
import { rulesToQuery } from "@casl/ability/extra";
import { NextFunction, Response } from "express";
import { Op } from "sequelize";
import { Request } from "../request";
import { IUserRead } from "../../users/dto/user-read.dto";
import { IProductRead } from "../../products/dto/product-read.dto";
import { Forbidden } from "http-errors";

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Actions = "manage" | "create" | "read" | "update" | "delete";
type ActionsAlias = { [p in Methods]: Actions };
type Subjects = "all" | "products" | "users";
type SubjectsAndStructures = Subjects | IProductRead | IUserRead;

const actionsAlias: ActionsAlias = {
	GET: "read",
	POST: "create",
	PUT: "update",
	PATCH: "update",
	DELETE: "delete",
};

function symbolize(query: any) {
	return JSON.parse(JSON.stringify(query), function keyToSymbol(key, value) {
		if (/^\$[a-z_]+$/gi.test(key)) {
			const k = key.slice(1) as keyof typeof Op;
			const symbol = Op[k];
			this[symbol] = value;
			return;
		}

		return value;
	});
}

function ruleToSequelize(rule: Rule<any, any>) {
	return rule.inverted ? { $not: rule.conditions } : rule.conditions;
}

function toSequelizeQuery(
	ability: Ability,
	subject: Subjects,
	action: Actions
) {
	const query = rulesToQuery(ability, action, subject, ruleToSequelize);
	return query === null ? query : symbolize(query);
}

function makeAbility(
	user: IUserRead | undefined,
	subject: string,
	action: Actions,
	target: string | number
) {
	type AppAbility = Ability<[Actions, SubjectsAndStructures]>;
	const ability = Ability as AbilityClass<AppAbility>;

	const { can, cannot, build } = new AbilityBuilder(ability);

	if (user) {
		if (user.role === "ADMIN") {
			can("manage", "all");
		} else {
			can("read", "users", { id: user.id });
			can("update", "users", { id: user.id });

			can("read", "products");
		}
	} else {
		can("create", "users");
		can("read", "products");
	}

	return build();
}

export function permissions(req: Request, res: Response, nf: NextFunction) {
	try {
		if (!req.queryAbilities) req.queryAbilities = {};

		const subject = /^\/(?<base>[a-z\d\-]+)?/gi.exec(req.baseUrl).groups
			.base as Subjects;
		const action = actionsAlias[req.method as Methods];
		const target: string | number = isNaN(+req.params.id)
			? req.params.id
			: +req.params.id;

		const ability = makeAbility(req.user, subject, action, target);

		if (!ability.can(action, subject)) {
			throw new Forbidden("Access Denied");
		}

		req.queryAbilities = toSequelizeQuery(ability, subject, action);

		nf();
	} catch (e: any) {
		res
			.status(e.status)
			.send({ name: e.name, message: e.message, stack: e.stack });
	}
}
