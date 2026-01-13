'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { salesreportdata } from '@/components/core/json/salesreportdata';
import OverviewCards from '@/components/home/OverviewCards';
import ReportFilters from '@/components/home/ReportFilters';
import SalesReport from '@/components/home/SalesReport';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export default function HomeDashboard({ name }: { name: string }) {
	const data = salesreportdata;
	const [searchText] = useState('');
	const [isMounted, setIsMounted] = useState(false);

	const filteredData = data.filter((entry: any) => {
		return Object.keys(entry).some((key: any) => {
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
			title: 'SKU',
			dataIndex: 'sku',
			sorter: (a: any, b: any) => a.sku.length - b.sku.length,
		},

		{
			title: 'Category',
			dataIndex: 'category',
			sorter: (a: any, b: any) => a.category.length - b.category.length,
		},

		{
			title: 'Brand',
			dataIndex: 'brand',
			sorter: (a: any, b: any) => a.brand.length - b.brand.length,
		},
		{
			title: 'Sold Qty',
			dataIndex: 'soldQty',
			sorter: (a: any, b: any) => a.soldQty.length - b.soldQty.length,
		},
		{
			title: 'Sold Amount',
			dataIndex: 'soldAmount',
			sorter: (a: any, b: any) => a.soldAmount.length - b.soldAmount.length,
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
							<h4>Hello {name}</h4>
							<h6>How&apos;s your day ? Let&apos;s do our best today !</h6>
						</div>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>

				<OverviewCards />
				<ReportFilters />
				<SalesReport />
			</div>
			<Footer />
		</div>
	);
}
