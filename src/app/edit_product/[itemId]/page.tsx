import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'react-feather';
import { redirect } from 'next/navigation';
import type { AppProps } from 'next/app';

import { convertTo } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { ItemDetails } from '@/components/edit_product/ItemDetails';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export const metadata: Metadata = {
	title: 'Edit Product',
};

export default async function Page({ params }: { params: Promise<{ itemId: string }> }) {
	const { itemId: p_itemId } = await params;
	const itemId = convertTo.number(p_itemId);
	if (itemId === null) return redirect(routes.productList);

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
					<ItemDetails itemId={itemId} />
				</div>
				<Footer />
			</div>
		</>
	);
}
