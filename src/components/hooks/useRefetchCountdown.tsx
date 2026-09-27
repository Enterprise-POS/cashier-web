import { useEffect, useState } from 'react';

export function useRefetchCountdown(dataUpdatedAt: number, intervalMs: number) {
	const [msLeft, setMsLeft] = useState(() => calc(dataUpdatedAt, intervalMs));

	useEffect(() => {
		// Recalculate immediately when dataUpdatedAt changes (i.e. a fetch just completed)
		setMsLeft(calc(dataUpdatedAt, intervalMs));

		const id = setInterval(() => {
			setMsLeft(calc(dataUpdatedAt, intervalMs));
		}, 1000); // tick every second

		return () => clearInterval(id);
	}, [dataUpdatedAt, intervalMs]);

	return msLeft;
}

function calc(dataUpdatedAt: number, intervalMs: number) {
	if (!dataUpdatedAt) return intervalMs;
	const nextRefetchAt = dataUpdatedAt + intervalMs;
	return Math.max(0, nextRefetchAt - Date.now());
}
