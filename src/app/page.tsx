import { getAuth } from '@/_lib/auth';
import BlankPage from '@/components/partials/blankpage';

export default async function Home() {
	const auth = await getAuth();
	if (auth === null) {
		return null;
	}

	return (
		<>
			<BlankPage name={auth.name} />
		</>
	);
}
