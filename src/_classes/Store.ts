import { StoreDef } from '@/_interface/StoreDef';

export class Store {
	id: number;
	name: string;
	isActive: boolean;
	tenantId: number;
	createdAt: Date;
	constructor(def: StoreDef) {
		this.id = def.id;
		this.name = def.name;
		this.isActive = def.is_active;
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
		this.tenantId = def.tenant_id;
	}
}
