enum Enum {
	ENUM0 = "EN",
	ENUM1 = "ENUM1",
}

type EnumT = "EN" | "ENUM1";

type Type = {
	attr1: string;
};

type Type2 = {
	[key in keyof Type]: Type[key];
} & {
	attr2: string;
};

interface Interface {
	attr1: string;
}

interface Interface2 extends Interface {
	attr2: string;
}

class Gen<TypeG> implements Interface2 {
	attr1: string;
	attr2: string;

	dataValues = {
		name: "ezequiel",
		email: "",
	};

	get name() {
		return this.dataValues.name;
	}

	set email(v: string) {
		// compare
		this.dataValues.name = v;
	}

	metodos() {}
}

function f<TypeG>(c: TypeG): TypeG {
	const keys: (keyof TypeG)[] = Object.keys(c) as (keyof TypeG)[];
	c[keys[0]];
	return c;
}

const t2: Type2 = { attr1: "", attr2: "" };
const t: Gen<any> = new Gen<any>();
t.attr1 = "attr";
console.log(t.name);
console.log(t.name);

const e: EnumT = "ENUM1";
