import { Input, Table, TablePaginationConfig, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, Delete, Edit, Package } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { HTTPResult } from '@/_interface/HTTPResult';
import { StoreStockDef, StoreStockV2Def } from '@/_interface/StoreStockDef';
import { TransferStockRequest } from '@/_interface/TransferStock';
import {
	editStoreStockInformation,
	getAllV2,
	transferStockToStoreStock,
	transferStockToWarehouse,
} from '@/_lib/store_stock';
import { useFormState } from '@/components/hooks/useFormState';
import { AddNewItem } from '@/components/manage_stocks/AddNewItem';
import { EditStoreStock } from '@/components/manage_stocks/EditStoreStock';
import EditStoreStockInformation from '@/components/manage_stocks/EditStoreStockInformation';
import WithdrawItemModal from '@/components/manage_stocks/WithdrawItemModal';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import SuccessToast from '@/components/toast/SuccessToast';
import ErrorToast from '@/components/toast/ErrorToast';

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

	const currentTenantId = storeCtx.getCurrentTenantId();
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
		// {
		// 	title: 'Product',
		// 	dataIndex: 'Product',
		// 	render: (text: any, record: any) => (
		// 		<span className="userimgname">
		// 			<Link href="#" className="product-img">
		// 				<img alt="img" src={record.Product.Image} />
		// 			</Link>
		// 			<Link href="#">{record.Product.Name}</Link>
		// 		</span>
		// 	),
		// 	sorter: (a: any, b: any) => a.Product.Name.length - b.Product.Name.length,
		// },

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
			title: 'Item Created At',
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
							className="me-2 p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#edit-info"
							onClick={() => setTobeEditStoreStock(storeStock)}
						>
							<Edit />
						</Link>
						<Link
							className="me-2 p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#edit-units"
							onClick={() => setTobeEditStoreStock(storeStock)}
						>
							<Package />
						</Link>
						<Link
							className="confirm-text p-2"
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							href="#"
							onClick={() => setTobeEditStoreStock(storeStock)}
						>
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
				// When the item successfully edited, then manually edit / set the reference
				// It's guaranteed to be available otherwise the request will be fail
				const newStocks = [...storeStocks]; // shallow clone array
				const target = newStocks.find(i => i.itemId === transferStockRequest.itemId);
				if (target !== undefined) {
					target.stocks += transferStockRequest.quantity; // Mutate targeted store_stocks item
				}
				setStoreStocks(newStocks);
				formState.setSuccess({ message: 'Product stock edited successfully' });
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	async function handleOnEditStoreStockInformation(editedStoreStock: StoreStockDef) {
		if (formState.state.isFormLoading) return;
		try {
			formState.setFormLoading(true);
			const { error } = await editStoreStockInformation(editedStoreStock);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				formState.setSuccess({ message: 'Product information edited successfully' });

				// When the item successfully edited, then manually edit / set the reference
				// It's guaranteed to be available otherwise the request will be fail
				const newStocks = [...storeStocks]; // shallow clone array
				const target = newStocks.find(i => i.id === editedStoreStock.id);
				if (target !== undefined) {
					target.price = editedStoreStock.price; // Mutate targeted store_stocks item
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

	useEffect(() => {
		if (selectedStore !== undefined) {
			getStoreStock(selectedStore.id, currentTenantId, pagination.current!, nameQuery);
		}

		// If store id changed or tenant id change, store provider will be re-render
		// Because <Table /> don't have direct to maintain selectedStore, we use this useEffect
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStore, nameQuery, currentTenantId]);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted || storeCtx.isStateLoading) return <SectionLoading caption={`Loading stores`} />;

	return (
		<>
			<SuccessToast
				isSuccess={formState.state.isSuccess}
				onClickCloseButton={() => formState.setState({ success: false })}
			>
				{formState.value.successMessage}
			</SuccessToast>
			<ErrorToast isError={formState.state.isError} onClickCloseButton={() => formState.setState({ error: false })}>
				{formState.value.errorMessage}
			</ErrorToast>

			{/* /product list */}
			<div className="card table-list-card  manage-stock">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="search-set">
						<Input.Search
							placeholder="Search items..."
							allowClear
							className="focus-ring"
							onSearch={value => {
								setNameQuery(value);
								setPagination(prev => ({ ...prev, current: 1 })); // reset to page 1
							}}
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
							<ul className="dropdown-menu dropdown-menu-end p-3">
								{storeCtx.data.storeList.map(store =>
									store.isActive ? (
										<li key={store.id} onClick={() => storeCtx.setCurrentStore(store.id)}>
											<Link href="#" className="dropdown-item rounded-1">
												{store.name}
											</Link>
										</li>
									) : (
										<Tooltip
											key={store.id}
											placement="leftTop"
											className="bg-danger-transparent"
											title="Warning this store currently inactive."
										>
											<li key={store.id} onClick={() => storeCtx.setCurrentStore(store.id)}>
												<Link href="#" className="dropdown-item rounded-1 d-flex justify-content-between">
													{store.name}
													<AlertTriangle width={16} height={16} />
												</Link>
											</li>
										</Tooltip>
									)
								)}
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
			<AddNewItem
				storeList={storeCtx.data.storeList}
				currentSelectedStoreId={selectedStore?.id ?? 0}
				onNewTransferItem={() => {}}
			/>

			<EditStoreStockInformation
				tobeEditStoreStock={tobeEditStoreStock}
				onConfirmEdit={handleOnEditStoreStockInformation}
				storeId={selectedStore?.id ?? 0}
				tenantId={storeCtx.getCurrentTenantId()}
			/>

			<EditStoreStock
				tobeEditStoreStock={tobeEditStoreStock}
				onConfirmEdit={handleOnConfirmEdit}
				storeId={selectedStore?.id ?? 0}
				tenantId={storeCtx.getCurrentTenantId()}
			/>

			<WithdrawItemModal
				onConfirmWithdraw={handleOnConfirmEdit}
				storeId={selectedStore?.id ?? 0}
				tenantId={storeCtx.getCurrentTenantId()}
				tobeWithdrawStoreStock={tobeEditStoreStock}
			/>
		</>
	);
}
