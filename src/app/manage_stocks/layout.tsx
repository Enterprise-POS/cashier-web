import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Enterprise POS - Manage Stock',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
