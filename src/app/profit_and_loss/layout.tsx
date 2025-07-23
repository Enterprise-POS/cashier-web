import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Profit and Loss - Enterprise POS',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
