import { CategoryDef } from '@/_interface/CategoryDef';

export class Category {
	id: number;
	categoryName: string;
	tenantId: number;
	createdAt: Date;
	constructor(def: CategoryDef) {
		this.id = def.id || 0;
		this.tenantId = def.tenant_id || 0;
		this.createdAt = def.created_at !== undefined ? new Date(def.created_at) : new Date(); // ex: '2025-09-18T04:06:50.812337Z';

		this.categoryName = def.category_name;
	}
}
