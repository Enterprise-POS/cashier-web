'use client';

import Footer from '@/components/partials/footer';
import StoreListComponent from '@/components/store_list/StoreListComponent';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

import Link from 'next/link';

export default function Employees() {
	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Store List</h4>
								<h6>Manage your stores</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-units">
								<i className="ti ti-circle-plus me-1"></i>
								Create new store
							</Link>
						</div>
					</div>
					{/* <div className="row">
						<div className="col-xl-3 col-md-6">
							<div className="card bg-purple border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Total Employee</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-purple-900">
											<i className="ti ti-users-group" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-teal border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Active</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-teal-900">
											<i className="ti ti-user-star" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-secondary border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Inactive</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-secondary-900">
											<i className="ti ti-user-exclamation" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-info border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">New Joiners</p>
										<h4 className="text-white">67</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-info-900">
											<i className="ti ti-user-check" />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div> */}
					{/* /product list */}
					<StoreListComponent />
				</div>
				<Footer />
			</div>
		</>
	);
}
