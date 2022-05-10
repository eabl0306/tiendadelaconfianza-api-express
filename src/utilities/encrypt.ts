import * as bcrypt from "bcrypt";

const saltRounds = 10;

export function encrypt(text: string): string {
	return bcrypt.hashSync(text, saltRounds);
}

export function compare(text: string, hash: string): boolean {
	return bcrypt.compareSync(text, hash);
}
