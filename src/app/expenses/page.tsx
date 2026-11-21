import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { all_routes as routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';
import ExpenseList from '@/components/expenses/ExpenseList';
import Footer from '@/components/partials/footer';

export default async function ExpensesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get(Constants.CookieKey.enterprisePOS)?.value ?? '';
	if (token === '') return redirect(routes.login);

	return (
		<div className="page-wrapper">
			<div className="content">
				<ExpenseList token={token} />
			</div>
			<Footer />
		</div>
	);
}
