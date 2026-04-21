import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'react-feather';

import { getCategories } from '@/_lib/category';
import { convertTo } from '@/_lib/utils';
import { findCompleteById } from '@/_lib/warehouse';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { Constants } from '@/components/core/data/constant';
import { ItemDetails } from '@/components/edit_product/ItemDetails';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export const metadata: Metadata = {
	title: 'Edit Product',
};

export default async function Page({ params }: { params: Promise<{ tenantId: string; itemId: string }> }) {
	// Check if user logged in
	const cookieStore = await cookies();
	const token = cookieStore.get(Constants.CookieKey.enterprisePOS)?.value ?? '';
	if (token === '') return redirect(routes.login);

	// Is requested item really exist
	const { itemId: p_itemId, tenantId: p_tenantId } = await params;
	const itemId = convertTo.number(p_itemId);
	const tenantId = convertTo.number(p_tenantId);
	if (itemId === null || tenantId === null) return redirect(routes.productList);

	const [categoryWithItemResult, categoriesResult] = await Promise.all([
		findCompleteById(itemId, tenantId),
		getCategories(tenantId, 1, 100, ''),
	]);
	if (categoryWithItemResult.error !== null || categoriesResult.error !== null) notFound();

	const { categoryWithItemDef, categoryDefs } = {
		categoryWithItemDef: categoryWithItemResult.result!,
		categoryDefs: categoriesResult.result!.categoryDefs,
	};

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Edit Product</h4>
								<h6>You can modified item information</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<RefreshIcon />
							<CollapseIcon />
							<li>
								<div className="page-btn">
									<Link href={routes.productList} className="btn btn-secondary">
										<ArrowLeft className="me-2" />
										Back to Product
									</Link>
								</div>
							</li>
						</ul>
					</div>
					<ItemDetails
						itemId={itemId}
						token={token}
						categoryWithItemDef={categoryWithItemDef}
						categoryDefs={categoryDefs}
					/>
				</div>
				<Footer />
			</div>
		</>
	);
}
