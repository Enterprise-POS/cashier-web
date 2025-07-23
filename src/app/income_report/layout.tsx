import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Income Report - Enterprise POS',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
