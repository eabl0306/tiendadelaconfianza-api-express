import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Rule } from "@casl/ability/dist/types/Rule";
import { rulesToQuery } from "@casl/ability/extra";
import { NextFunction, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { Request } from "../request";
import { IUserRead } from "../../users/dto/user-read.dto";
import { IProductRead } from "../../products/dto/product-read.dto";
import { Forbidden } from "http-errors";
import { EUserRole } from "../../users/dto/user.dto";

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

async function makeAbility(
	user: IUserRead | undefined,
	subject: string,
	action: Actions,
	target: string | number
) {
	type AppAbility = Ability<[Actions, SubjectsAndStructures]>;
	const ability = Ability as AbilityClass<AppAbility>;

	const { can, build } = new AbilityBuilder(ability);

	if (user && user.role === EUserRole.SUPER_ADMIN) {
		can("manage", "all");
		return build();
	}

	type PermissionsQuery =
		| WhereOptions
		| ((
				user: IUserRead | undefined,
				subject: string,
				action: Actions,
				target: string | number
		  ) => Promise<WhereOptions>);
	type Permissions = {
		module: Subjects;
		action: Actions[];
		query?: PermissionsQuery;
	};

	async function getActiveProduct() {
		//
		return {};
	}

	async function applyPermission(permissions: Permissions[]) {
		for (let i = 0; i < permissions.length; i++) {
			const permission = permissions[i];
			if (permission.module === subject && permission.action.includes(action)) {
				const query =
					(typeof permission.query === "function"
						? await permission.query(user, subject, action, target)
						: permission.query) || {};
				can(permission.action, permission.module, query);
			}
		}
	}

	if (user && user.role === EUserRole.ADMIN) {
		const userPermissions: Permissions[] = [
			{ module: "products", action: ["create", "update", "delete"] },
		];
		await applyPermission(userPermissions);
	}

	if (user && [EUserRole.ADMIN, EUserRole.USER].includes(user.role)) {
		const userPermissions: Permissions[] = [
			{ module: "products", action: ["read"], query: getActiveProduct },
			{ module: "users", action: ["read"], query: { id: user.id } },
		];
		await applyPermission(userPermissions);
	}

	if (!user) {
		const userPermissions: Permissions[] = [
			{ module: "products", action: ["read"], query: getActiveProduct },
			{ module: "users", action: ["create"] },
		];
		await applyPermission(userPermissions);
	}

	return build();
}

export async function permissions(
	req: Request,
	res: Response,
	nf: NextFunction
) {
	try {
		if (!req.queryAbilities) req.queryAbilities = {};

		const subject = /^\/(?<base>[a-z\d\-]+)?/gi.exec(req.baseUrl).groups
			.base as Subjects;
		const action = actionsAlias[req.method as Methods];
		const target: string | number = isNaN(+req.params.id)
			? req.params.id
			: +req.params.id;

		const ability = await makeAbility(req.user, subject, action, target);

		if (!ability.can(action, subject)) {
			errorForbidden();
		}

		req.queryAbilities = toSequelizeQuery(ability, subject, action);

		nf();
	} catch (e: any) {
		res
			.status(e.status)
			.send({ name: e.name, message: e.message, stack: e.stack });
	}
}

function errorForbidden() {
	throw new Forbidden("Access Denied");
}
