'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Input, Pagination, Table, Tooltip } from 'antd';
import { SorterResult } from 'antd/es/table/interface.js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, HelpCircle } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { Tenant } from '@/_classes/Tenant';
import { StockType } from '@/_interface/ItemDef';
import { formatIDR } from '@/_lib/utils';
import EditAdjustment from '@/components/edit_store_products/EditAdjustment';
import { useEditStockInfoQuery } from '@/components/hooks/useEditStockInfoQuery';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import { useTenant } from '@/components/provider/TenantProvider';
import { useEditStockInfoStore } from '@/components/store/editStockInfoStore';
import { all_routes as routes } from '@/components/core/data/all_routes';

export default function EditStockInfoComponent({ token }: { token: string }) {
	const router = useRouter();
	const storeCtx = useStore();
	const tenantCtx = useTenant();
	const queryClient = useQueryClient();
	const [isMounted, setIsMounted] = useState(false);
	const [tobeEditStoreStock, setTobeEditStoreStock] = useState<StoreStockV2>();

	const pagination = useEditStockInfoStore(s => s.pagination);
	const nameQuery = useEditStockInfoStore(s => s.nameQuery);
	const isError = useEditStockInfoStore(s => s.isError);
	const isSuccess = useEditStockInfoStore(s => s.isSuccess);
	const errorMessage = useEditStockInfoStore(s => s.errorMessage);
	const successMessage = useEditStockInfoStore(s => s.successMessage);

	const setPagination = useEditStockInfoStore(s => s.setPagination);
	const setNameQuery = useEditStockInfoStore(s => s.setNameQuery);
	// const setCreatedAtSorter = useEditStockInfoStore(s => s.setCreatedAtSorter);
	const applyFilters = useEditStockInfoStore(s => s.applyFilters);
	const clearError = useEditStockInfoStore(s => s.clearError);
	const clearSuccess = useEditStockInfoStore(s => s.clearSuccess);
	const handleSortChange = useEditStockInfoStore(s => s.handleSortChange);
	const handleConfirmEdit = useEditStockInfoStore(s => s.handleConfirmEdit);

	const selectedTenant = tenantCtx.data.tenantList.find(t => t.id === tenantCtx.data.selectedTenantId) as
		| Tenant
		| undefined;
	const selectedStore = storeCtx.data.storeList.find(s => s.id === storeCtx.data.selectedStoreId) as Store | undefined;

	const { data, isFetching } = useEditStockInfoQuery(token);
	const storeStocks = data?.storeStocks ?? [];
	const total = data?.total ?? 0;

	useEffect(() => {
		if (total > 0) setPagination({ ...pagination, total });
	}, [total]);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted || storeCtx.isStateLoading) return <SectionLoading caption="Loading store products..." />;

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.id - b.id,
		},
		{
			title: 'Product',
			dataIndex: 'itemName',
			// sorter: (a: StoreStockV2, b: StoreStockV2) => a.itemName.length - b.itemName.length,
		},
		{
			title: (
				<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					Selling Price
					<Tooltip title="Selling price is what the customer pays. Edit the product to configure it.">
						<HelpCircle size={13} color="#8c8c8c" style={{ cursor: 'help', flexShrink: 0 }} />
					</Tooltip>
				</span>
			),
			dataIndex: 'price',
			// sorter: (a: StoreStockV2, b: StoreStockV2) => a.price - b.price,
			render: (price: number) => {
				if (price === 0)
					return (
						<Tooltip title="No selling price configured. Click edit to set one.">
							<p className="fst-italic text-muted" style={{ cursor: 'help', marginBottom: 0 }}>
								— not set
							</p>
						</Tooltip>
					);
				return formatIDR(price);
			},
		},
		{
			title: 'Base Price',
			dataIndex: 'basePrice',
			render: (basePrice: number, item: StoreStockV2) => {
				if (basePrice === 0)
					return (
						<Tooltip title="No base price configured. Click this to edit base price.">
							<p
								className="fst-italic text-muted"
								style={{ marginBottom: 0, cursor: 'pointer' }}
								onClick={() => {
									router.push(
										routes.editProduct
											.replace('<tenantId>', storeCtx.getCurrentTenantId().toString())
											.replace('<itemId>', item.itemId.toString()),
									);
								}}
							>
								— not set
							</p>
						</Tooltip>
					);
				return formatIDR(basePrice);
			},
		},
		{
			title: 'T/U',
			dataIndex: 'stockType',
			// sorter: (a: StoreStockV2, b: StoreStockV2) => a.stockType.length - b.stockType.length,
			render: (stockType: StockType) => stockType.at(0),
		},
		{
			title: 'Item Created At',
			dataIndex: 'createdAt',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (date: Date) => date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (_id: number, storeStock: StoreStockV2) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link
							className="me-2 p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#edit-units"
							onClick={() => (isFetching ? null : setTobeEditStoreStock(storeStock))}
						>
							<Edit />
						</Link>
					</div>
				</div>
			),
		},
	];

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${isSuccess ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success!</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={clearSuccess}
						/>
					</div>
					<div className="toast-body">{successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${isError ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={clearError}
						/>
					</div>
					<div className="toast-body">{errorMessage}</div>
				</div>
			</div>

			<div className="card table-list-card manage-stock">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="d-flex gap-3">
						<div className="search-set">
							<Input.Search
								placeholder="Search items..."
								allowClear
								className="focus-ring"
								value={nameQuery}
								onChange={e => setNameQuery(e.target.value)}
								onSearch={applyFilters}
							/>
						</div>
						{/* <div className="page-btn">
							<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3 ms-auto">
								<div className="dropdown mb-0">
									<button
										className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center text-gray-3"
										data-bs-toggle="dropdown"
									>
										Order: Created at {sortCreatedAt === SortBy.ASCENDING ? 'Oldest' : 'Latest'}
									</button>
									<ul className="dropdown-menu dropdown-menu-end p-3">
										<li>
											<button className="dropdown-item rounded-1" onClick={() => setCreatedAtSorter(SortBy.DESCENDING)}>
												Latest
											</button>
										</li>
										<li>
											<button className="dropdown-item rounded-1" onClick={() => setCreatedAtSorter(SortBy.ASCENDING)}>
												Oldest
											</button>
										</li>
									</ul>
								</div>
							</div>
						</div> */}
						<button
							className={`btn btn-primary ${isFetching ? 'wait' : ''}`}
							disabled={isFetching}
							onClick={applyFilters}
						>
							{isFetching ? 'Please wait' : 'Search'}
						</button>
					</div>
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
						<div className="dropdown">
							<button
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								{selectedStore?.name ?? 'Select Store'}
							</button>
							<ul className="dropdown-menu dropdown-menu-end p-3">
								{storeCtx.data.storeList.map(store => (
									<li key={store.id} onClick={() => storeCtx.setCurrentStore(store.id)}>
										<Link href="#" className="dropdown-item rounded-1">
											{store.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				<div className="custom-datatable-filter table-responsive">
					<Table<StoreStockV2>
						rowKey={'itemId'}
						columns={columns}
						dataSource={storeStocks}
						pagination={false}
						loading={{ spinning: isFetching, indicator: <SectionLoading /> }}
						onChange={(_, __, sorter) =>
							handleSortChange(sorter as SorterResult<StoreStockV2> | SorterResult<StoreStockV2>[])
						}
						footer={currentPageData => {
							const tracked = currentPageData.filter(s => s.stockType === StockType.TRACKED).length;
							const sellingPriceUnset = currentPageData.filter(s => s.price === 0).length;
							const basePriceUnset = currentPageData.filter(s => s.basePrice === 0).length;
							return (
								<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 text-muted small">
									<div className="d-flex gap-3">
										<span>
											<strong>{currentPageData.length}</strong> items on this page
										</span>
										<span className="vr" />
										<span>
											<strong>{tracked}</strong> tracked · <strong>{total - tracked}</strong> unlimited
										</span>
										<span className="vr" />
										<span>
											<strong>{sellingPriceUnset}</strong> selling price{sellingPriceUnset !== 1 ? 's' : ''} not set
										</span>
										<span className="vr" />
										<span>
											<strong>{basePriceUnset}</strong> base price{basePriceUnset !== 1 ? 's' : ''} not set
										</span>
									</div>
									<div className="text-muted">{pagination.total} total records</div>
								</div>
							);
						}}
					/>
				</div>

				<div className="d-flex justify-content-md-end py-3 px-3">
					<Pagination
						current={pagination.current}
						pageSize={pagination.pageSize}
						total={pagination.total}
						showSizeChanger={true}
						onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
					/>
				</div>
			</div>

			<EditAdjustment
				selectedTenant={selectedTenant}
				selectedStore={selectedStore}
				tobeEditStoreStock={tobeEditStoreStock}
				handleForm={async e => {
					e.preventDefault();
					await handleConfirmEdit(new FormData(e.currentTarget), token, queryClient, isFetching);
				}}
			/>
		</>
	);
}
