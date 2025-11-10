'use client';

import { purchasereportdata } from '@/components/core/json/purchasedreportdata';
import { ProductName, Store } from '@/components/core/json/selectOption';
import Table from '@/components/pagination/datatable';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

import { DatePicker } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export default function PurchaseReportComponent() {
	const data = purchasereportdata;
	const [isMounted, setIsMounted] = useState(false);

	const [searchText] = useState('');
	const filteredData = data.filter((entry: any) => {
		return Object.keys(entry).some(key => {
			return String(entry[key]).toLowerCase().includes(searchText.toLowerCase());
		});
	});

	const columns = [
		{
			title: 'Product Name',
			dataIndex: 'productName',
			render: (text: any, record: any) => (
				<span className="productimgname">
					<Link href="#" className="product-img stock-img">
						<img alt="" src={record.img} />
					</Link>
					<Link href="#">{text}</Link>
				</span>
			),
			sorter: (a: any, b: any) => a.productName.length - b.productName.length,
		},
		{
			title: 'Product Amount',
			dataIndex: 'productAmount',
			sorter: (a: any, b: any) => a.productAmount.length - b.productAmount.length,
		},

		{
			title: 'Product Qty',
			dataIndex: 'productQty',
			sorter: (a: any, b: any) => a.productQty.length - b.productQty.length,
		},

		{
			title: 'Instock Qty',
			dataIndex: 'instockQty',
			sorter: (a: any, b: any) => a.instockQty.length - b.instockQty.length,
		},
	];
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="add-item d-flex">
						<div className="page-title">
							<h4>Purchase report</h4>
							<h6>Manage your Purchase report</h6>
						</div>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>
				<div className="card border-0">
					<div className="card-body pb-1">
						<form>
							<div className="row align-items-end">
								<div className="col-lg-10">
									<div className="row">
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Choose Date</label>
												<div className="input-icon-start position-relative">
													<DatePicker className="form-control datetimepicker" placeholder="dd/mm/yyyy" />
													<span className="input-icon-left">
														<i className="ti ti-calendar" />
													</span>
												</div>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Store</label>
												<Select classNamePrefix="react-select" options={Store} placeholder="Choose" />
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Products</label>
												<Select classNamePrefix="react-select" options={ProductName} placeholder="Choose" />
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-2">
									<div className="mb-3">
										<button className="btn btn-primary w-100" type="submit">
											Generate Report
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

				{/* /product list */}
				<div className="card table-list-card hide-search">
					<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
						<div>
							<h4>Customer Report</h4>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<li>
								<Link href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
									<i className="ti ti-printer" />
								</Link>
							</li>
						</ul>
					</div>

					<div className="card-body">
						<div className="table-responsive">{/* <Table columns={columns} dataSource={filteredData} /> */}</div>
					</div>
				</div>
				{/* /product list */}
			</div>
			<Footer />
		</div>
	);
}
