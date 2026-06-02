import { StoreDef } from '@/_interface/StoreDef';

export class Store {
	id: number;
	name: string;
	isActive: boolean;
	tenantId: number;
	updatedAt: Date;
	createdAt: Date;
	address: string;
	phoneNumber: string;
	constructor(def: StoreDef) {
		this.id = def.id;
		this.name = def.name;
		this.isActive = def.is_active;
		this.address = def.address ?? '';
		this.phoneNumber = def.phone_number ?? '';
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
		this.updatedAt = def.updated_at !== undefined ? new Date(def.updated_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';
		this.tenantId = def.tenant_id;
	}

	copy(): Store {
		return new Store({
			id: this.id,
			name: this.name,
			address: this.address,
			phone_number: this.phoneNumber,
			is_active: this.isActive,
			tenant_id: this.tenantId,
			created_at: this.createdAt.toISOString(),
			updated_at: this.updatedAt.toISOString(),
		});
	}
}
