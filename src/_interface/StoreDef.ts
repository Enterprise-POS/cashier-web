export interface StoreDef {
	id: number;
	name: string;
	is_active: boolean;
	tenant_id: number;
	address?: string;
	phone_number?: string;
	created_at: string;
	updated_at: string;
}
