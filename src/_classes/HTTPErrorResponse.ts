export class HTTPErrorResponse extends Error {
	status: string = 'error';
	override name: string;
	constructor(public code: number, message: string) {
		super(message);
		this.name = 'HTTPErrorResponse';
	}
}
