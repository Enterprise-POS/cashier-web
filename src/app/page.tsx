import { getAuth } from '@/_lib/auth';
import { Constants } from '@/components/core/data/constant';
import HomeDashboard from '@/components/home/HomeDashboard';
import { HomeDashboardProvider } from '@/components/provider/HomeDashboardProvider';
import { cookies } from 'next/headers';

export default async function Home() {
	const auth = await getAuth();
	if (auth === null) {
		return null;
	}

	const cookieStore = await cookies();
	const token = cookieStore.get(Constants.CookieKey.enterprisePOS)?.value ?? '';

	return (
		<>
			{/* <BlankPage name={auth.name} /> */}

			{/* Only used in this page only */}
			<HomeDashboardProvider token={token}>
				<HomeDashboard name={auth.name} />
			</HomeDashboardProvider>
		</>
	);
}
