import { UserDef } from '@/_interface/UserDef';

export class User {
	id: number;
	createdAt: Date;
	name: string;
	email: string;
	constructor(def: UserDef) {
		this.id = def.id;
		this.name = def.name;
		this.email = def.email;
		this.createdAt = new Date(def.created_at);
	}
}
