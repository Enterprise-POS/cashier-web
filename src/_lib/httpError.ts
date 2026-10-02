const sensitiveMessagePattern =
	/(?:bearer\s+\S+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+|\b(?:password|passphrase|token|secret|api[_ -]?key|authorization|cookie)\b\s*[:=]\s*\S+|[\w.+-]+@[\w.-]+\.[A-Z]{2,}|\b(?:SQLSTATE|syntax error at|query failed|stack trace|fatal error while parsing|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|database connection|postgres(?:ql)?|mysql|mongodb|redis)\b|(?:[A-Z]:\\|\/(?:var|home|usr|app)\/)|\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b|\b\w+\.(?:ts|js):\d+(?::\d+)?|<[^>]+>)/i;

function fallbackMessage(status: number): string {
	switch (status) {
		case 400:
			return 'The request could not be processed. Please check your input.';
		case 401:
			return 'Your session may have expired. Please sign in again.';
		case 403:
			return 'You do not have permission to perform this action.';
		case 404:
			return 'The requested information could not be found.';
		case 409:
			return 'This request conflicts with existing information.';
		case 422:
			return 'Some of the submitted information is invalid. Please check your input.';
		default:
			return status >= 400 && status < 500
				? 'The request could not be completed. Please check your input and try again.'
				: 'Something went wrong. Please try again later.';
	}
}

export function getUserFacingHttpError(status: number, message: unknown): string {
	if (status >= 500) console.error(`[SERVER ERROR] HTTP ${status}`);

	if (
		typeof message !== 'string' ||
		message.trim().length === 0 ||
		message.length > 500 ||
		/[\r\n]/.test(message) ||
		sensitiveMessagePattern.test(message)
	) {
		return fallbackMessage(status);
	}

	return message.trim();
}
