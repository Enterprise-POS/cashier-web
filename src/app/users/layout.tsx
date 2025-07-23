import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Users - Enterprise POS',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
