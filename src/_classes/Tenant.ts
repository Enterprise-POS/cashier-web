import { TenantDef } from '@/_interface/TenantDef';

export class Tenant {
	id: number;
	name: string;
	ownerUserId: number;
	isActive: boolean;
	constructor(def: TenantDef) {
		this.id = def.id;
		this.name = def.name;
		this.ownerUserId = def.owner_user_id;
		this.isActive = def.is_active;
		// this.ownerUserId
		// We can validate optimistically here. Yet of course backend will validating again
	}
}
