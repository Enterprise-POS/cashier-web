export interface HTTPSuccessResponse<T> {
	code: number;
	status: string;
	data: T;
}
