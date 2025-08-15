export interface UserDef {
	id: number;
	name: string;
	email: string;
	created_at: string; // will be converted into Date when changing to User
}
