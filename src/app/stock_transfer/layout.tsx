import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Enterprise POS - Stock Transfer',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
