const primitiveTypes = ["boolean", "string", "number", "undefined"];

function keysOf(obj: any) {
	return Reflect.ownKeys(obj);
}

export function merge<T extends any>(target: T, ...args: T[]): T {
	for (let i = 0; i < args.length; i++) {
		const keys = keysOf(args[i] || {});
		for (let j = keys.length - 1; j >= 0; j--) {
			const key = keys[j] as keyof T;
			if (
				primitiveTypes.includes(typeof args[i][key]) ||
				args[i][key] === null
			) {
				target[key] = args[i][key];
			} else if (Array.isArray(args[i][key])) {
				if (Array.isArray(target[key])) {
					// @ts-ignore
					target[key].push(args[i][key]);
				} else {
					target[key] = args[i][key];
				}
			} else {
				if (!target[key]) target[key] = {} as any;
				target[key] = merge(target[key], args[i][key]);
			}
		}
	}

	return target;
}
