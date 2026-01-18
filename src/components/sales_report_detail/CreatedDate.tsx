'use client';

import { useEffect, useState } from 'react';

export default function CreatedDate({ epochTime }: { epochTime: number }) {
	const [dateString, setDateString] = useState('');

	useEffect(() => {
		setDateString(new Date(epochTime).toLocaleString());
	}, [epochTime]);

	return (
		<p className="mb-1 fw-medium">
			Created Date : <span className="text-dark">{dateString}</span>
		</p>
	);
}
