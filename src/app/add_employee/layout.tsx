import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Enterprise POS - Add Employee',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
