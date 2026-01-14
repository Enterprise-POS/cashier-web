import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sales Report Detail',
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return children;
}
