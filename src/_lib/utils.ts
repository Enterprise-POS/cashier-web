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

export function openBootstrapModal(selector: string) {
	const modalElement = document.querySelector(selector);

	if (modalElement) {
		// Bootstrap 5 way
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const modal = new (window as any).bootstrap.Modal(modalElement);
		modal.show();
	}
}

export function setStringPrefix(val: string | number, prefix: string): string {
	return val.toString().padStart(val.toString().length + 1, prefix);
}

export function toEpochInSeconds(epochInMs: number): number {
	return Math.round(epochInMs / 1000);
}

const idrFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

export function formatIDR(value: number): string {
	return idrFormatter.format(value);
}
