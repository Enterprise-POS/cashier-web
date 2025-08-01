export class HTTPErrorResponse<T> {
	status: string = 'error';
	constructor(public code: number, public data: T) {}
}
