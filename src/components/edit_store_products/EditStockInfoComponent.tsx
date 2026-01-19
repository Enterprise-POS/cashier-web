import { Input, Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
import { FormEventHandler, useEffect, useState } from 'react';
import { Edit } from 'react-feather';

import { Store } from '@/_classes/Store';
import { StoreStockV2 } from '@/_classes/StoreStock';
import { Tenant } from '@/_classes/Tenant';
import { HTTPResult } from '@/_interface/HTTPResult';
import { StockType } from '@/_interface/ItemDef';
import { StoreStockV2Def } from '@/_interface/StoreStockDef';
import { editStoreStock, getAllV2 } from '@/_lib/store_stock';
import { closeBootstrapModal, convertTo } from '@/_lib/utils';
import EditAdjustment from '@/components/edit_store_products/EditAdjustment';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useStore } from '@/components/provider/StoreProvider';
import { useTenant } from '@/components/provider/TenantProvider';

export default function EditStockInfoComponent() {
	const limit = 10;
	const [isMounted, setIsMounted] = useState(false);
	const storeCtx = useStore();
	const tenantCtx = useTenant();
	const formState = useFormState();

	const [nameQuery, setNameQuery] = useState('');
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1, // By default when user open is 1
		pageSize: limit,
		total: 0,
		responsive: true,
	});
	const [storeStocks, setStoreStocks] = useState<StoreStockV2[]>([]);

	const [tobeEditStoreStock, setTobeEditStoreStock] = useState<StoreStockV2>();

	const selectedTenant: Tenant | undefined = tenantCtx.data.tenantList.find(
		tenant => tenant.id === tenantCtx.data.selectedTenantId,
	);
	const selectedStore: Store | undefined = storeCtx.data.storeList.find(
		store => store.id === storeCtx.data.selectedStoreId,
	);

	useEffect(() => setIsMounted(true), []);
	useEffect(() => {
		if (selectedStore !== undefined) {
			getStoreStock(selectedStore.id, storeCtx.getCurrentTenantId(), pagination.current!, nameQuery);
		}

		// If store id changed or tenant id change, store provider will be re-render
		// Because <Table /> don't have direct to maintain selectedStore, we use this useEffect
	}, [selectedStore, nameQuery]);

	if (!isMounted || storeCtx.isStateLoading) return <SectionLoading caption={`Loading store products...`} />;

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
			title: 'T/U',
			dataIndex: 'stockType',
			sorter: (a: StoreStockV2, b: StoreStockV2) => a.stockType.length - b.stockType.length,
			render: (stockType: StockType) => stockType.at(0),
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
							data-bs-target="#edit-units"
							onClick={() => setTobeEditStoreStock(storeStock)}
						>
							<Edit />
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
				search,
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

	const handleForm: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		const { isFormLoading } = formState.state;
		if (isFormLoading || !tobeEditStoreStock) return;
		formState.setFormLoading(true);

		try {
			const formData = new FormData(e.currentTarget);

			const { error }: HTTPResult<void> = await editStoreStock(formData);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				// Because it's guaranteed to success then take immediately the changed value here
				const price: FormDataEntryValue | null = formData.get('price');
				const id: FormDataEntryValue | null = formData.get('id');

				const convertedId = convertTo.number(id);
				const convertedPrice = convertTo.number(price);
				if (convertedPrice === null || convertedId === null) {
					formState.setSuccess({
						message: 'Product edited successfully, something wrong while refreshing edited item',
					});
				} else {
					setStoreStocks(
						storeStocks.map(storeStock =>
							storeStock.id === convertedId
								? new StoreStockV2({
										id: storeStock.id,
										item_id: storeStock.itemId,
										item_name: storeStock.itemName,
										stock_type: storeStock.stockType,
										stocks: storeStock.stocks,
										price: convertedPrice,
										created_at: storeStock.createdAt.toString(),
									})
								: storeStock,
						),
					);
					formState.setSuccess({ message: 'Edited successfully' });
					closeBootstrapModal('#edit-units [data-bs-dismiss="modal"]');
				}
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.warn(err);
			formState.setError({ message });
		} finally {
			formState.setFormLoading(false);
		}
	};

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
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="toast"
							aria-label="Close"
							onClick={() => formState.setState({ success: false })}
						></button>
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

			<div className="card table-list-card manage-stock">
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

			{/* Edit Adjustment */}
			<EditAdjustment
				selectedTenant={selectedTenant}
				selectedStore={selectedStore}
				tobeEditStoreStock={tobeEditStoreStock}
				handleForm={handleForm}
			/>
			{/* /Edit Adjustment */}
			{/* View Notes */}
			<div className="modal fade" id="view-notes">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Notes</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							<p>
								The Jordan brand is owned by Nike (owned by the Knight family), as, at the time, the company was
								building its strategy to work with athletes to launch shows that could inspire consumers.Although Jordan
								preferred Converse and Adidas, they simply could not match the offer Nike made. Jordan also signed with
								Nike because he loved the way they wanted to market him with the banned colored shoes. Nike promised to
								cover the fine Jordan would receive from the NBA.
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* /View Notes */}
		</>
	);
}

/**
	<div className="modal fade" id="add-units">
		<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
			<div className="modal-content">
				<div className="modal-header">
					<div className="page-title">
						<h4>Add Adjustment</h4>
					</div>
					<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
				</div>
				<form>
					<div className="modal-body">
						<div className="search-form mb-3">
							<label className="form-label">
								Product<span className="text-danger ms-1">*</span>
							</label>
							<input type="text" className="form-control" placeholder="Search Product" />
							<Search className="feather-search" />
						</div>
						<div className="row">
							<div className="col-lg-6">
								<div className="mb-3">
									<label className="form-label">
										Warehouse<span className="text-danger ms-1">*</span>
									</label>
									<Select classNamePrefix="react-select" options={WareHouse} placeholder="Choose" />
								</div>
							</div>
							<div className="col-lg-6">
								<div className="mb-3">
									<label className="form-label">
										Reference Number
										<span className="text-danger ms-1">*</span>
									</label>
									<input type="text" className="form-control" />
								</div>
							</div>
							<div className="col-lg-12">
								<div className="mb-3">
									<label className="form-label">
										Store<span className="text-danger ms-1">*</span>
									</label>
									<Select classNamePrefix="react-select" options={Store} placeholder="Choose" />
								</div>
							</div>
							<div className="col-lg-12">
								<div className="mb-3">
									<label className="form-label">
										Responsible Person
										<span className="text-danger ms-1">*</span>
									</label>
									<Select classNamePrefix="react-select" options={ResponsiblePerson} placeholder="Choose" />
								</div>
							</div>
						</div>
						<div className="col-lg-12">
							<div className="summer-description-box">
								<label className="form-label">
									Notes<span className="text-danger ms-1">*</span>
								</label>
								<textarea className="form-control" defaultValue={''} />
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
							Cancel
						</button>
						<Link href="#" className="btn btn-primary" data-bs-dismiss="modal">
							Create Adjustment
						</Link>
					</div>
				</form>
			</div>
		</div>
	</div>
 */
