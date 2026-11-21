'use client';

import VouchersList from '@/components/voucher_list/VouchersList';
import Footer from '@/components/partials/footer';
import { useTenant } from '@/components/provider/TenantProvider';
import CollapseIcon from '@/components/tooltip-content/collapse';

export default function VouchersPage() {
	const { data } = useTenant();
	return (
		<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="add-item d-flex">
						<div className="page-title">
							<h4 className="fw-bold">Vouchers</h4>
							<h6>Manage your vouchers</h6>
						</div>
					</div>
					<ul className="table-top-head">
						<CollapseIcon />
					</ul>
					<div className="page-btn">
						<button
							type="button"
							className="btn btn-primary"
							data-bs-toggle="modal"
							data-bs-target="#add-vouchers"
							disabled={data.selectedTenantId === 0}
						>
							<i className="ti ti-circle-plus me-1"></i>
							Add Vouchers
						</button>
					</div>
				</div>
				<VouchersList />
			</div>
			<Footer />
		</div>
	);
}
