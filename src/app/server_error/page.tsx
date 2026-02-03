'use client';

import { all_routes as routes } from '@/components/core/data/all_routes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Custom505() {
	const [errorMessage, setErrorMessage] = useState('An unexpected error occurred');

	useEffect(() => {
		const lastError = sessionStorage.getItem('lastError');
		const errorTime = sessionStorage.getItem('lastErrorTime');

		// ✅ Only show error if recent (within 5 seconds)
		if (lastError && errorTime) {
			const timeDiff = Date.now() - parseInt(errorTime);
			if (timeDiff < 5000) {
				setErrorMessage(lastError);
			}
		}

		// Clean up
		sessionStorage.removeItem('lastError');
		sessionStorage.removeItem('lastErrorTime');
	}, []);
	return (
		<div className="main-wrapper">
			<div className="error-box">
				<div className="error-img">
					<img src="/assets/img/authentication/error-500.png" className="img-fluid" alt="image" />
				</div>
				<h3 className="h2 mb-3">Oops, something went wrong</h3>
				<p>Error 500 Internal Server Error. Sorry for the inconvenience, we will fix the page immediately</p>
				<p>Error Details: {errorMessage}</p>
				<Link href={routes.index} className="btn btn-primary">
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
