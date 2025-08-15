import { getAuth } from '@/_lib/auth';
import HeaderFloatingMenu from '@/components/partials/header/HeaderFloatingMenu';
import HeaderBody from '@/components/partials/header/HeaderBody';

export default async function Header() {
	const auth = await getAuth();
	if (auth === null) return null;

	return (
		<HeaderBody>
			<HeaderFloatingMenu name={auth.name} sub={auth.sub} />
		</HeaderBody>
	);
}
