'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Input, Table } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Delete, Edit } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { StockType } from '@/_interface/ItemDef';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { transferStockToStoreStock, transferStockToWarehouse } from '@/_lib/store_stock';
import { closeBootstrapModal, formatIDR } from '@/_lib/utils';
import { useManageStocksQuery } from '@/components/hooks/useManageStocksQuery';
import { AddNewItem } from '@/components/manage_stocks/AddNewItem';
import { EditStoreStock } from '@/components/manage_stocks/EditStoreStock';
import { SelectCategory } from '@/components/manage_stocks/SelectCategory';
import WithdrawItemModal from '@/components/manage_stocks/WithdrawItemModal';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import { useManageStocksStore } from '@/components/store/manageStocksStore';

export default function ManageStocksComponents({ token }: { token: string }) {
	const storeCtx = useStore();
	const queryClient = useQueryClient();
	const [isMounted, setIsMounted] = useState(false);
	const [tobeEditStoreStock, setTobeEditStoreStock] = useState<StoreStockV2>();
	const [isSelectCategoryModalOpen, setCategoryModal] = useState(false);

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
	const isAscending = useManageStocksStore(s => s.ascending);

	// Action
	const setSelectedCategory = useManageStocksStore(s => s.setSelectedCategory);
	const setAscending = useManageStocksStore(s => s.setAscending);
	const setPagination = useManageStocksStore(s => s.setPagination);
	const setNameQuery = useManageStocksStore(s => s.setNameQuery);
	const setLoading = useManageStocksStore(s => s.setLoading);
	const setError = useManageStocksStore(s => s.setError);
	const setSuccess = useManageStocksStore(s => s.setSuccess);
	const clearError = useManageStocksStore(s => s.clearError);
	const clearSuccess = useManageStocksStore(s => s.clearSuccess);
	const resetFilters = useManageStocksStore(s => s.resetFilters);
	const applyFilters = useManageStocksStore(s => s.applyFilters);

	const currentTenantId = storeCtx.getCurrentTenantId();
	const selectedStore: Store | undefined = storeCtx.data.storeList.find(
		store => store.id === storeCtx.data.selectedStoreId,
	);

	// TanStack handles fetching — auto-refetches when queryKey changes
	const { data, isFetching } = useManageStocksQuery(token);
	const storeStocks = data?.storeStocks ?? [];
	const total = data?.total ?? 0;

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.id - b.id,
		},
		{
			title: 'Product',
			dataIndex: 'itemName',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.itemName.length - b.itemName.length,
		},
		{
			title: 'Price',
			dataIndex: 'price',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.price - b.price,
			render: (price: number) => formatIDR(price),
		},
		{
			title: 'Category',
			dataIndex: 'categoryName',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.categoryName.length - b.categoryName.length,
			render: (categoryName: string) => (categoryName.length > 0 ? categoryName : '-'),
		},
		{
			title: 'Stocks',
			dataIndex: 'stocks',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.stocks - b.stocks,
		},
		{
			title: 'T/U',
			dataIndex: 'stockType',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.stockType.length - b.stockType.length,
			render: (stockType: StockType) => <p className="text-center">{stockType.at(0)}</p>,
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.createdAt.getTime() - b.createdAt.getTime(),
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
						<Link href="#" className="confirm-text p-2" data-bs-toggle="modal" data-bs-target="#delete-modal">
							<Delete />
						</Link>
					</div>
				</div>
			),
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.createdAt.getTime() - b.createdAt.getTime(),
		},
	];

	async function handleOnConfirmEdit(transferStockRequest: TransferStockRequest) {
		if (isFetching || transferStockRequest.quantity === 0) return;

		try {
			setLoading(true);
			let result;

			if (transferStockRequest.quantity > 0) result = await transferStockToStoreStock(transferStockRequest, token);
			else
				result = await transferStockToWarehouse(
					{ ...transferStockRequest, quantity: -transferStockRequest.quantity },
					token,
				);

			const { error } = result;
			if (error !== null) {
				setError(error);
			} else {
				setSuccess('Product edited successfully');
				// Invalidate to refetch fresh data
				queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			}
		} catch (e) {
			const error = e as Error;
			setError(`Unexpected error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	}

	async function handleTransferItem(transferStockRequest: TransferStockRequest, itemName: string) {
		if (isFetching) return;
		setLoading(true);
		const { error } = await transferStockToStoreStock(transferStockRequest, token);
		if (error !== null) {
			setError(error);
		} else {
			setNameQuery('');
			// Invalidate to refetch fresh data
			queryClient.invalidateQueries({ queryKey: ['storeStocks'] });
			setSuccess(`${itemName} successfully added to ${selectedStore!.name}`);
			closeBootstrapModal('#add-units [data-bs-dismiss="modal"]');
		}
		setLoading(false);
	}

	useEffect(() => setIsMounted(true), []);

	useEffect(() => {
		const modal = document.getElementById('select-category');
		modal?.addEventListener('hidden.bs.modal', () => setCategoryModal(false));
	}, []);

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
					className={`toast ${isError ? 'show' : ''} colored-toast bg-danger-transparent`}
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
							onSearch={() => applyFilters()}
						/>
					</div>
					<div className="page-btn">
						<button
							className="btn border text-secondary"
							data-bs-toggle="modal"
							data-bs-target="#select-category"
							onClick={() => setCategoryModal(true)}
						>
							{selectedCategory.categoryId === 0 ? 'Select Category' : `Category: ${selectedCategory.categoryName}`}
						</button>
					</div>
					<div className="page-btn">
						<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3 ms-auto">
							<div className="dropdown mb-0">
								<button
									className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center text-gray-3"
									data-bs-toggle="dropdown"
								>
									Order: {isAscending ? 'Ascending' : 'Descending'}
								</button>
								<ul className="dropdown-menu dropdown-menu-end p-3">
									<li>
										<Link href="#" className="dropdown-item rounded-1" onClick={() => setAscending(true)}>
											Ascending
										</Link>
									</li>
									<li>
										<Link href="#" className="dropdown-item rounded-1" onClick={() => setAscending(false)}>
											Descending
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary w-100 ${isLoading || isFetching ? 'wait' : ''}`}
							type="button"
							disabled={isLoading || isFetching}
							onClick={() => applyFilters()}
						>
							{isLoading || isFetching ? 'Please wait' : 'Search'}
						</button>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary-ghost w-100 ${isLoading || isFetching ? 'disabled' : ''}`}
							type="button"
							disabled={isLoading || isFetching}
							onClick={() => resetFilters()}
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

				<div className="card-body">
					<div className="custom-datatable-filter table-responsive">
						<Table<StoreStockV2>
							rowKey={'itemId'}
							columns={columns}
							dataSource={storeStocks}
							pagination={{ ...pagination, total }} // Inject real total
							loading={{ spinning: isFetching, indicator: <SectionLoading /> }}
							onChange={
								newPagination =>
									setPagination({
										...pagination,
										current: newPagination.current!,
										pageSize: newPagination.pageSize!,
									})
								// Changing pagination in Zustand changes queryKey → TanStack auto-refetches
							}
						/>
					</div>
				</div>
			</div>

			<WithdrawItemModal />
			<AddNewItem
				storeList={storeCtx.data.storeList}
				currentSelectedStoreId={selectedStore?.id ?? 0}
				onNewTransferItem={handleTransferItem}
				loading={isFetching}
			/>
			<EditStoreStock
				tobeEditStoreStock={tobeEditStoreStock}
				onConfirmEdit={handleOnConfirmEdit}
				storeId={selectedStore?.id ?? 0}
				tenantId={currentTenantId}
			/>
			<SelectCategory
				tenantId={currentTenantId}
				isModalOpen={isSelectCategoryModalOpen}
				onSelected={(categoryId, categoryName) => {
					setCategoryModal(false);
					setSelectedCategory({ categoryId, categoryName });
				}}
			/>
		</>
	);
}
