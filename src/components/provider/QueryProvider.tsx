'use client'; // Required! QueryClientProvider is a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { HttpRequestError } from '@/_lib/utils';

export function QueryProvider({ children }: { children: React.ReactNode }) {
	// useState prevents recreating QueryClient on every render
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						refetchOnReconnect: false,
						retry: (failureCount, error) =>
							failureCount < 3 &&
							(error instanceof TypeError || (error instanceof HttpRequestError && error.status >= 500)),
						retryDelay: 250,
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
