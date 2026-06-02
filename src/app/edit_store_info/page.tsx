import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'react-feather';

import { all_routes as routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';
import EditStoreInfoComponent from '@/components/edit_store_info/EditStoreInfoComponent';
import { EditStoreInfoTitle } from '@/components/edit_store_info/EditStoreInfoTitle';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export const metadata: Metadata = {
	title: 'Edit Store Info',
};

export default async function Page() {
	// Check if user logged in
	const cookieStore = await cookies();
	const token = cookieStore.get(Constants.CookieKey.enterprisePOS)?.value ?? '';
	if (token === '') return redirect(routes.login);

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<EditStoreInfoTitle />
							</div>
						</div>
						<ul className="table-top-head">
							<RefreshIcon />
							<CollapseIcon />
							<li>
								<div className="page-btn">
									<Link href={routes.storeList} className="btn btn-secondary">
										<ArrowLeft className="me-2" />
										All store list
									</Link>
								</div>
							</li>
						</ul>
					</div>
					<EditStoreInfoComponent />
				</div>
				<Footer />
			</div>
		</>
	);
}
