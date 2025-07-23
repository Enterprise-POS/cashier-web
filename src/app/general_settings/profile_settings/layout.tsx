import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Enterprise POS - Profile Settings',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
