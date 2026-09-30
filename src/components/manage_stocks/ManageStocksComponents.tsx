'use client';
import { useQueryClient } from '@tanstack/react-query';
import { ConfigProvider, Input, Pagination, Table, TableColumnsType, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Delete, Edit, HelpCircle } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { StockType } from '@/_interface/ItemDef';
import { SortState } from '@/_interface/QueryFilter';
import { formatIDR } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { useManageStocksQuery } from '@/components/hooks/useManageStocksQuery';
import { AddNewItem } from '@/components/manage_stocks/AddNewItem';
import { EditStoreStock } from '@/components/manage_stocks/EditStoreStock';
import WithdrawItemModal from '@/components/manage_stocks/WithdrawItemModal';
import SectionLoading from '@/components/partials/SectionLoading';
import { useCategoriesQuery } from '@/components/product_list/useProductListQuery';
import { useStore } from '@/components/provider/StoreProvider';
import { useManageStocksStore } from '@/components/store/manageStocksStore';

export default function ManageStocksComponents({ token }: { token: string }) {
	const router = useRouter();
	const storeCtx = useStore();
	const queryClient = useQueryClient();
	const [isMounted, setIsMounted] = useState(false);
	const [tobeEditStoreStock, setTobeEditStoreStock] = useState<StoreStockV2>();
	const [tobeWithdrawStoreStock, setTobeWithdrawStoreStock] = useState<StoreStockV2>();

	// Only subscribe to what this component needs — no unnecessary re-renders
	// Read value
	const pagination = useManageStocksStore(s => s.pagination);
	const nameQuery = useManageStocksStore(s => s.nameQuery);
	const isLoading = useManageStocksStore(s => s.isLoading);
	const isError = useManageStocksStore(s => s.isError);
	const isSuccess = useManageStocksStore(s => s.isSuccess);
	const errorMessage = useManageStocksStore(s => s.errorMessage);
	const successMessage = useManageStocksStore(s => s.successMessage);
	const selectedCategory = useManageStocksStore(s => s.selectedCategory);
	const appliedSorts = useManageStocksStore(s => s.appliedSorts);

	// Action
	const setPagination = useManageStocksStore(s => s.setPagination);
	const setNameQuery = useManageStocksStore(s => s.setNameQuery);
	const setError = useManageStocksStore(s => s.setError);
	const clearError = useManageStocksStore(s => s.clearError);
	const clearSuccess = useManageStocksStore(s => s.clearSuccess);
	const resetFilters = useManageStocksStore(s => s.resetFilters);
	const applyFilters = useManageStocksStore(s => s.applyFilters);
	const applyTableChange = useManageStocksStore(s => s.applyTableChange);

	// Async actions
	//const handleTransferItem = useManageStocksStore(s => s.handleTransferItem);
	const handleTransferItems = useManageStocksStore(s => s.handleTransferItems);
	const handleOnConfirmWithdraw = useManageStocksStore(s => s.handleConfirmWithdraw);
	const handleOnConfirmEdit = useManageStocksStore(s => s.handleConfirmEdit);

	const currentTenantId = storeCtx.getCurrentTenantId();
	const selectedStore: Store | undefined = storeCtx.data.storeList.find(
		store => store.id === storeCtx.data.selectedStoreId,
	);

	// TanStack handles fetching — auto-refetches when queryKey changes
	const manageStocksQuery = useManageStocksQuery(token);
	const { data, isFetching } = manageStocksQuery;
	const categoriesQuery = useCategoriesQuery(currentTenantId);
	const storeStocks = data?.storeStocks ?? [];
	const total = data?.total ?? 0;

	const categoryFilters = useMemo(
		() =>
			(categoriesQuery.data ?? []).map(category => ({
				text: category.categoryName,
				value: category.id,
			})),
		[categoriesQuery.data],
	);

	const getSortOrder = (column: SortState['column']) => {
		const sort = appliedSorts.find(current => current.column === column);
		return sort ? (sort.ascending ? 'ascend' : 'descend') : null;
	};

	type TableSorter = Parameters<NonNullable<TableProps<StoreStockV2>['onChange']>>[2];

	const getSortsFromTable = (tableSorter: TableSorter): SortState[] => {
		const activeSorters = Array.isArray(tableSorter) ? tableSorter : [tableSorter];
		const sortColumnMap: Record<string, { column: SortState['column']; priority: number }> = {
			itemName: { column: 'item_name', priority: 2 },
			createdAt: { column: 'created_at', priority: 1 },
		};

		return activeSorters
			.flatMap(activeSorter => {
				if (!activeSorter.order) return [];

				const fieldName = Array.isArray(activeSorter.field)
					? activeSorter.field.at(0)?.toString()
					: activeSorter.field?.toString();
				const sortColumn = fieldName === undefined ? undefined : sortColumnMap[fieldName];
				if (sortColumn === undefined) return [];

				return [
					{
						...sortColumn,
						ascending: activeSorter.order === 'ascend',
					},
				];
			})
			.sort((a, b) => b.priority - a.priority)
			.map(({ column, ascending }) => ({ column, ascending }));
	};

	const handleTableChange: TableProps<StoreStockV2>['onChange'] = (_pagination, filters, tableSorter) => {
		const categoryFilter = filters.categoryId?.at(0);
		const categoryId = Number(categoryFilter ?? 0);
		const categoryName =
			categoryId === 0
				? 'unselected'
				: (categoriesQuery.data?.find(category => category.id === categoryId)?.categoryName ??
					selectedCategory.categoryName);

		applyTableChange({ categoryId, categoryName }, getSortsFromTable(tableSorter));
	};

	const columns: TableColumnsType<StoreStockV2> = [
		{
			title: 'ID',
			dataIndex: 'itemId',
		},
		{
			title: 'Product',
			dataIndex: 'itemName',
			sorter: { multiple: 2 },
			sortOrder: getSortOrder('item_name'),
		},
		{
			title: (
				<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					Selling Price
					<Tooltip title="Selling price is what the customer pays.">
						<HelpCircle size={13} color="#8c8c8c" style={{ cursor: 'help', flexShrink: 0 }} />
					</Tooltip>
				</span>
			),
			dataIndex: 'price',
			// sorter: (a: StoreStockV2, b: StoreStockV2) => a.price - b.price,
			render: (price: number) => {
				if (price === 0)
					return (
						<Tooltip title="No selling price configured. Go to Edit Store Products to set selling price.">
							<p className="fst-italic text-muted" style={{ cursor: 'pointer', marginBottom: 0 }}>
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
						<Tooltip title="No base price configured. Click this to edit base price." style={{ cursor: 'pointer' }}>
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
			title: 'Category',
			dataIndex: 'categoryId',
			filters: categoryFilters,
			filterMultiple: false,
			filteredValue: selectedCategory.categoryId === 0 ? null : [selectedCategory.categoryId],
			render: (_categoryId: number, item: StoreStockV2) => (item.categoryName.length > 0 ? item.categoryName : '-'),
		},
		{
			title: 'Stocks',
			dataIndex: 'stocks',
		},
		{
			title: 'T/U',
			dataIndex: 'stockType',
			render: (stockType: StockType) => <p className="text-center">{stockType.at(0)}</p>,
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: { multiple: 1 },
			sortOrder: getSortOrder('created_at'),
			render: (date: Date) => date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (id: number, storeStock: StoreStockV2) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link
							href="#"
							className="me-2 p-2"
							data-bs-toggle="modal"
							data-bs-target="#edit-units"
							onClick={() => (isFetching ? null : setTobeEditStoreStock(storeStock))}
						>
							<Edit />
						</Link>
						<Link
							href="#"
							className="confirm-text p-2"
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							onClick={() => (isFetching ? null : setTobeWithdrawStoreStock(storeStock))}
						>
							<Delete />
						</Link>
					</div>
				</div>
			),
		},
	];

	// Sync total after fetch into pagination so Antd knows how many pages to render, otherwise the page button always render button 1
	// We want <[1][2][3]> even the page is loading
	// Without this useEffect sync with Ant every time the button click and loading it
	// render <[1]> rather than render <[1][2][3]>
	useEffect(() => {
		if (total > 0) setPagination({ ...pagination, total });
	}, [total]);

	useEffect(() => {
		if (manageStocksQuery.isError) {
			const error = manageStocksQuery.error;
			setError(error instanceof Error ? error.message : 'Failed to load store stocks');
		}
	}, [manageStocksQuery.isError]);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted || storeCtx.isStateLoading) return <SectionLoading caption="Loading stores" />;

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
						<strong className="me-auto">Success !</strong>
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

			{/* Align Left */}
			<div className="card table-list-card manage-stock">
				<div className="card-header gap-3 d-flex align-items-center flex-wrap row-gap-3">
					<div className="search-set">
						<Input.Search
							className="focus-ring"
							placeholder="Search items..."
							allowClear
							value={nameQuery}
							onChange={e => setNameQuery(e.target.value)}
							onSearch={applyFilters}
						/>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary w-100 ${isLoading || isFetching ? 'wait' : ''}`}
							type="button"
							disabled={isLoading || isFetching}
							onClick={applyFilters}
						>
							{isLoading || isFetching ? 'Please wait' : 'Search'}
						</button>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary-ghost w-100 ${isLoading || isFetching ? 'disabled' : ''}`}
							type="button"
							disabled={isLoading || isFetching}
							onClick={resetFilters}
						>
							Reset
						</button>
					</div>

					{/* Align Right */}
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3 ms-auto">
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
					<ConfigProvider theme={{ token: { colorPrimary: '#fe9f43' } }}>
						<Table<StoreStockV2>
							rowKey={'itemId'}
							columns={columns}
							dataSource={storeStocks}
							pagination={false}
							loading={{ spinning: isFetching, indicator: <SectionLoading /> }}
							onChange={handleTableChange}
						/>
					</ConfigProvider>
				</div>

				<div className="d-flex justify-content-center justify-content-md-end py-3 px-3">
					<Pagination
						current={pagination.current}
						pageSize={pagination.pageSize}
						total={pagination.total} //  Was: rather than use total from data
						showSizeChanger={false}
						onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
					/>
				</div>
			</div>

			<WithdrawItemModal
				tenantId={currentTenantId}
				storeId={selectedStore?.id ?? 0}
				tobeWithdrawStoreStock={tobeWithdrawStoreStock}
				onConfirmWithdraw={body => handleOnConfirmWithdraw(body, token, queryClient, isFetching)}
			/>

			<EditStoreStock
				tobeEditStoreStock={tobeEditStoreStock}
				onConfirmEdit={body => handleOnConfirmEdit(body, token, queryClient, isFetching)}
				storeId={selectedStore?.id ?? 0}
				tenantId={currentTenantId}
			/>
			{/* This modal connect with Page: manage_stocks */}
			<AddNewItem
				storeList={storeCtx.data.storeList}
				currentSelectedStoreId={selectedStore?.id ?? 0}
				loading={isFetching || isLoading}
				onNewTransferItems={items =>
					handleTransferItems(items, selectedStore?.name ?? '', token, queryClient, isFetching)
				}
			/>
		</>
	);
}
