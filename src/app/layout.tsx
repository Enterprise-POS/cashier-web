import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';

import '@/assets/plugins/fontawesome/css/all.min.css';
import '@/assets/plugins/fontawesome/css/fontawesome.min.css';

import '@/assets/plugins/tabler-icons/tabler-icons.min.css';

import '@/assets/css/bootstrap.min.css';
import '@/assets/scss/main.scss';

import Header from '@/components/partials/header';
import Sidebar from '@/components/partials/sidebar';
import Script from 'next/script';

export const metadata: Metadata = {
	title: 'Enterprise POS - Inventory Management & Admin Dashboard',
	description:
		'Enterprise POS is a powerful Bootstrap-based Inventory Management Admin Template designed for businesses, offering seamless invoicing, project tracking, and estimates.',
	keywords:
		'inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system',
	authors: [{ name: 'Aaron Fabian Saputra' }],
	icons: {
		icon: '/assets/favicon.png',
		shortcut: '/assets/favicon.png', // Add shortcut icon for better support
		apple: '/assets/favicon.png', // Optional: for Apple devices (place in `public/`)
	},
	robots: {
		follow: true,
		index: true,
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0,
};
export const nunito = Nunito({
	subsets: ['latin'],
	variable: '--Nunito',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* <!-- Meta Tags --> */}
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			</head>
			<body className={`${nunito.variable} ${nunito.variable} antialiased main-wrapper`} data-layout="default">
				<Header />

				<Sidebar />

				{children}

				<Script src="/assets/js/jquery-3.7.1.min.js" />

				{/* <!-- Bootstrap Core JS --> */}
				<Script src="/assets/js/bootstrap.bundle.min.js" />

				{/* <!-- Feather Icon JS --> */}
				<Script src="/assets/js/feather.min.js" />

				{/* <!-- Slimscroll JS --> */}
				<Script src="/assets/js/jquery.slimscroll.min.js" />

				{/* <!-- Color Picker JS --> */}
				<Script src="/assets/js/script.js" />
			</body>
		</html>
	);
}
