export const convertTo = {
	number: (v: unknown) => {
		const value = Number(v);
		return isNaN(value) ? null : value;
	},
};

export function closeBootstrapModal(selector: string) {
	// Because bootstrap modal not maintained by react, programmatic close modal
	const closeButton = document.querySelector(selector);
	if (closeButton) {
		(closeButton as HTMLElement).click();
	}
}

export function setStringPrefix(val: string | number, prefix: string): string {
	return val.toString().padStart(val.toString().length + 1, prefix);
}

export function toEpochInSeconds(epochInMs: number): number {
	return Math.round(epochInMs / 1000);
}
