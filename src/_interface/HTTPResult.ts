export interface HTTPResult<T> {
	result: T | null;
	error: string | null;
}
