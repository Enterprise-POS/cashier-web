import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Customers - Enterprise POS',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
