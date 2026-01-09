import { Input, Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Delete, Edit } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { HTTPResult } from '@/_interface/HTTPResult';
import { StockType } from '@/_interface/ItemDef';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { TransferStockRequest } from '@/_interface/TransferStock';
import { getAllV2, transferStockToStoreStock, transferStockToWarehouse } from '@/_lib/store_stock';
import { closeBootstrapModal } from '@/_lib/utils';
import { useFormState } from '@/components/hooks/useFormState';
import { AddNewItem } from '@/components/manage_stocks/AddNewItem';
import { EditStoreStock } from '@/components/manage_stocks/EditStoreStock';
import WithdrawItemModal from '@/components/manage_stocks/WithdrawItemModal';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';

export default function ManageStocksComponents() {
	const limit = 10;
	const storeCtx = useStore();
	const formState = useFormState();
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1, // By default when user open is 1
		pageSize: limit,
		total: 0,
		responsive: true,
	});
	const [nameQuery, setNameQuery] = useState('');
	const [isMounted, setIsMounted] = useState(false);
	const [storeStocks, setStoreStocks] = useState<StoreStockV2[]>([]);
	const [tobeEditStoreStock, setTobeEditStoreStock] = useState<StoreStockV2>();

	const selectedStore: Store | undefined = storeCtx.data.storeList.find(
		store => store.id === storeCtx.data.selectedStoreId
	);

	const dataSource = storeStocks;
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
			render: (date: Date) => date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
		},
		{
			title: 'Action',
			dataIndex: 'id',
			render: (id: number, storeStock: StoreStockV2) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<div className="input-block add-lists"></div>
						<Link
							href="#"
							className="me-2 p-2"
							data-bs-toggle="modal"
							data-bs-target="#edit-units"
							onClick={() => (formState.state.isFormLoading ? null : setTobeEditStoreStock(storeStock))}
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

	async function getStoreStock(storeId: number, tenantId: number, page: number, search: string) {
		if (formState.state.isFormLoading) return;

		try {
			formState.setFormLoading(true);
			const { result, error }: HTTPResult<{ count: number; storeStockDefs: StoreStockV2Def[] }> = await getAllV2(
				storeId,
				tenantId,
				pagination.current!,
				limit,
				search
			);
			if (error !== null) {
				// A special condition that maybe user not yet transfer any warehouse items
				if (error.includes('[ERROR] no stock found')) {
					setStoreStocks([]);
					setPagination({ ...pagination, current: 1, total: 0 });
				} else {
					formState.setError({ message: error });
				}
			} else {
				setStoreStocks(result!.storeStockDefs.map((def: StoreStockV2Def) => new StoreStockV2(def)));
				setPagination({ ...pagination, current: page, total: result!.count });
			}
		} catch (e: unknown) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	async function handleOnConfirmEdit(transferStockRequest: TransferStockRequest) {
		if (formState.state.isFormLoading || transferStockRequest.quantity === 0) return;

		try {
			formState.setFormLoading(true);
			let result: HTTPResult<void>;

			// If quantity > 0 Else quantity < 0
			if (transferStockRequest.quantity > 0) result = await transferStockToStoreStock(transferStockRequest);
			else {
				// Because quantity <= 0 could not be requested when transferring stock then we convert the value to positive value
				result = await transferStockToWarehouse({ ...transferStockRequest, quantity: -transferStockRequest.quantity });
			}

			// Take only the error result, if error not null then tell the user
			const { error } = result;
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				formState.setSuccess({ message: 'Product edited successfully' });

				// When the item successfully edited, then manually edit / set the reference
				// It's guaranteed to be available otherwise the request will be fail
				const newStocks = [...storeStocks]; // shallow clone array
				const target = newStocks.find(i => i.itemId === transferStockRequest.itemId);
				if (target !== undefined) {
					target.stocks += transferStockRequest.quantity; // Mutate targeted store_stocks item
				}
				setStoreStocks(newStocks);
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	async function handleTransferItem(transferStockRequest: TransferStockRequest, itemName: string) {
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);
		const { error } = await transferStockToStoreStock(transferStockRequest);
		if (error !== null) {
			formState.setError({ message: error });
		} else {
			setNameQuery('');
			await getStoreStock(selectedStore!.id, storeCtx.getCurrentTenantId(), 1, '');
			formState.setSuccess({ message: `${itemName} successfully added to ${selectedStore!.name}` });
			closeBootstrapModal('#add-units [data-bs-dismiss="modal"]');
		}
		formState.setFormLoading(false);
	}

	function handleInputSearch(value: string) {
		setNameQuery(value);
		setPagination(prev => ({ ...prev, current: 1 })); // reset to page 1
	}

	useEffect(() => {
		if (selectedStore !== undefined) {
			getStoreStock(selectedStore.id, storeCtx.getCurrentTenantId(), pagination.current!, nameQuery);
		}

		// If store id changed or tenant id change, store provider will be re-render
		// Because <Table /> don't have direct to maintain selectedStore, we use this useEffect
	}, [selectedStore, nameQuery]);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted || storeCtx.isStateLoading) return <SectionLoading caption={`Loading stores`} />;

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isSuccess ? 'show' : ''} colored-toast`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success !</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{formState.value.successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isError ? 'show' : ''} colored-toast bg-danger-transparent`}
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
							onClick={() => formState.setState({ error: false })}
						></button>
					</div>
					<div className="toast-body">{formState.value.errorMessage}</div>
				</div>
			</div>

			{/* /product list */}
			<div className="card table-list-card  manage-stock">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="search-set">
						<Input.Search
							placeholder="Search items..."
							allowClear
							className="focus-ring"
							onSearch={value => handleInputSearch(value)}
						/>
					</div>
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
						<div className="dropdown">
							<button
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								{selectedStore?.name ?? 'Select Store'}
							</button>
							<ul className="dropdown-menu  dropdown-menu-end p-3">
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
							dataSource={dataSource}
							pagination={pagination}
							loading={{
								spinning: formState.state.isFormLoading,
								indicator: <SectionLoading />,
							}}
							onChange={newPagination =>
								getStoreStock(selectedStore!.id, storeCtx.getCurrentTenantId(), newPagination.current!, nameQuery)
							}
						/>
					</div>
				</div>
			</div>
			{/* /product list */}
			<WithdrawItemModal />

			<AddNewItem
				storeList={storeCtx.data.storeList}
				currentSelectedStoreId={selectedStore?.id ?? 0}
				onNewTransferItem={handleTransferItem}
				loading={formState.state.isFormLoading}
			/>

			<EditStoreStock
				tobeEditStoreStock={tobeEditStoreStock}
				onConfirmEdit={handleOnConfirmEdit}
				storeId={selectedStore?.id ?? 0}
				tenantId={storeCtx.getCurrentTenantId()}
			/>
		</>
	);
}
