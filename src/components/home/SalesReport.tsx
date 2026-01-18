import Link from 'next/link';

import { OrderItem } from '@/_classes/OrderItem';
import { useHomeDashboard } from '@/components/provider/HomeDashboardProvider';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';
import { all_routes as routes } from '@/components/core/data/all_routes';

import { Table, Tooltip } from 'antd';
import { Eye } from 'react-feather';

export default function SalesReport() {
	const { data, getSalesReport, selectedTenantId } = useHomeDashboard();
	const pagination = data.pagination;
	const dataSource = data.orderItems;
	const currentSelectedTenantId = selectedTenantId;

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a: OrderItem, b: OrderItem) => a.id - b.id,
		},
		{
			title: 'Purchased Price',
			dataIndex: 'purchasedPrice',
			sorter: (a: OrderItem, b: OrderItem) => a.purchasedPrice - b.purchasedPrice,
		},
		{
			title: 'Sub Total',
			dataIndex: 'subTotal',
			sorter: (a: OrderItem, b: OrderItem) => a.subTotal - b.subTotal,
		},
		{
			title: 'Gross Sales',
			dataIndex: 'subTotal',
			sorter: (a: OrderItem, b: OrderItem) => a.totalAmount - b.totalAmount,
		},
		{
			title: 'Change',
			dataIndex: 'id',
			sorter: (a: OrderItem, b: OrderItem) => a.purchasedPrice - a.totalAmount - (b.purchasedPrice - b.totalAmount),
			render: (id: number, orderItem: OrderItem) => orderItem.purchasedPrice - orderItem.totalAmount,
		},
		{
			title: 'Date',
			dataIndex: 'createdAt',
			sorter: (a: OrderItem, b: OrderItem) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (id: number, orderItem: OrderItem) => orderItem.createdAt.toLocaleString(navigator.language),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (id: number) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Tooltip title={`See transactions detail. (${id})`} placement="bottom">
							<Link className="me-2 p-2" href={routes.salesReportDetail + `/${id}?tenant_id=${selectedTenantId}`}>
								<Eye />
							</Link>
						</Tooltip>
					</div>
				</div>
			),
			sorter: (a: OrderItem, b: OrderItem) => a.createdAt.getTime() - b.createdAt.getTime(),
		},
	];

	return (
		<div className="card table-list-card hide-search">
			<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
				<div>
					<h4>Sales Report</h4>
				</div>
				<ul className="table-top-head">
					{/* <TooltipIcons /> */}
					<li>
						<Tooltip title="Refresh">
							<Link href="#">
								<i className="ti ti-refresh"></i>
							</Link>
						</Tooltip>
					</li>
					<li>
						<Tooltip title="Print Report">
							<Link href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Print">
								<i className="ti ti-printer" />
							</Link>
						</Tooltip>
					</li>
				</ul>
			</div>

			<div className="card-body">
				<div className="table-responsive">
					<Table<OrderItem>
						rowKey={'id'}
						pagination={pagination}
						columns={columns}
						onChange={newPagination => getSalesReport(newPagination.current!, newPagination.pageSize!)}
						dataSource={dataSource}
					/>
				</div>
			</div>
		</div>
	);
}
