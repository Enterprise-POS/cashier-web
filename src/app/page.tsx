import { getAuth } from '@/_lib/auth';
import HomeDashboard from '@/components/home/HomeDashboard';
import { HomeDashboardProvider } from '@/components/provider/HomeDashboardProvider';

export default async function Home() {
	const auth = await getAuth();
	if (auth === null) {
		return null;
	}

	return (
		<>
			{/* <BlankPage name={auth.name} /> */}

			{/* Only used in this page only */}
			<HomeDashboardProvider>
				<HomeDashboard name={auth.name} />
			</HomeDashboardProvider>
		</>
	);
}
