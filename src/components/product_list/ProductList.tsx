'use client';
import { Input, Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
import { startTransition, useEffect, useOptimistic, useState } from 'react';
import { Edit, Eye, Trash2 } from 'react-feather';

import { Item } from '@/_classes/Item';
import { Tenant } from '@/_classes/Tenant';
import { HTTPResult } from '@/_interface/HTTPResult';
import { ItemDef, StockType } from '@/_interface/ItemDef';
import { getActiveWarehouseItem, setItemActivate } from '@/_lib/warehouse';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import CategoryDropdown from '@/components/product_list/CategoryDropdown';
import { useTenant } from '@/components/provider/TenantProvider';

export default function ProductList({ limit, page }: { limit: number; page: number }) {
	const { data, isStateLoading: isUseTenantLoading } = useTenant();
	const [isComponentLoading, setComponentLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [search, setSearch] = useState('');
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10,
		total: 0,
		responsive: true,
	});

	const [warehouseItems, setWarehouseItems] = useState<Item[]>([]);
	const [currentDeleteModalData, setCurrentDeleteModalData] = useState<{ itemId: number; name: string } | null>(null);
	const [optimisticItems, optimisticDelete] = useOptimistic(warehouseItems, (currItems: Item[], itemId) => {
		return currItems.filter(item => item.id !== itemId);
	});

	const formState = useFormState();

	const dataSource = optimisticItems;
	const columns = [
		{
			title: 'ID',
			dataIndex: 'itemId',
			sorter: (a: Item, b: Item) => a.itemId - b.itemId,
		},
		{
			title: 'Product',
			dataIndex: 'itemName',
			render: (text: string, item: Item) => (
				<div className="d-flex align-items-center">
					{/* <Link href="#" className="avatar avatar-md me-2">
						<img alt="" src={item.productImage} />
					</Link> */}
					<Link href={routes.editProduct.replace('<itemId>', item.id.toString())}>{text}</Link>
				</div>
			),
			sorter: (a: Item, b: Item) => a.itemName.length - b.itemName.length,
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: (a: Item, b: Item) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (date: Date) => date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
		},
		{
			title: 'Unit',
			dataIndex: 'unit',
			sorter: (a: Item, b: Item) => a.unit.length - b.unit.length,
		},
		{
			title: 'Stocks',
			dataIndex: 'stocks',
			sorter: (a: Item, b: Item) => a.stocks - b.stocks,
			render: (stocks: number) => <p className="text-center">{stocks}</p>,
		},
		{
			title: 'T/U',
			dataIndex: 'stockType',
			sorter: (a: Item, b: Item) => a.stockType.length - b.stockType.length,
			render: (stockType: StockType) => <p className="text-center">{stockType.at(0)}</p>,
		},

		// {
		// 	title: 'Created By',
		// 	dataIndex: 'createdby',
		// 	render: (text: any, record: any) => (
		// 		<span className="userimgname">
		// 			<Link href="/profile" className="product-img">
		// 				<img alt="" src={record.img} />
		// 			</Link>
		// 			<Link href="/profile">{text}</Link>
		// 		</span>
		// 	),
		// 	sorter: (a: any, b: any) => a.createdby.length - b.createdby.length,
		// },
		{
			title: 'Action',
			dataIndex: 'itemId',
			render: (itemId: number, item: Item) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link className="me-2 p-2" href={routes.productdetails}>
							<Eye className="feather-view" />
						</Link>
						<Link className="me-2 p-2" href={routes.editProduct.replace('<itemId>', itemId.toString())}>
							<Edit className="feather-edit" />
						</Link>
						<Link
							className="confirm-text p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							onClick={() => setCurrentDeleteModalData({ itemId, name: item.itemName })}
						>
							<Trash2 className="feather-trash-2" />
						</Link>
					</div>
				</div>
			),
			sorter: (a: Item, b: Item) => a.createdAt.getTime() - b.createdAt.getTime(),
		},
	];

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	async function getData(page: number, limit: number, nameQuery: string) {
		if (isComponentLoading) return;
		try {
			setComponentLoading(true);
			if (selectedTenant !== undefined) {
				const { result, error }: HTTPResult<{ itemDefs: ItemDef[]; count: number }> = await getActiveWarehouseItem(
					selectedTenant.id,
					limit,
					page,
					nameQuery
				);
				if (error !== null) {
					formState.setError({ message: error });
				} else {
					setWarehouseItems(() => result!.itemDefs.map(itemDef => new Item(itemDef)));
					setPagination({ current: page, pageSize: limit, total: result!.count });
				}
			} else {
				// Probably tenant not yet available or user not yet joined any tenant
			}
		} catch (e) {
			const error = e as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			setComponentLoading(false);
		}
	}

	async function handleRemoveItem(itemName: string, itemId: number, tenantId: number) {
		try {
			startTransition(() => optimisticDelete(itemId));
			const { error } = await setItemActivate(itemId, tenantId, false);

			// When error occurred, the optimistic will rollback the data
			if (error !== null) {
				console.warn(error);
				formState.setError({ message: error });
				setTimeout(() => formState.setState({ error: false }), 5000);
			} else {
				// This will make react not to render again the deleted user
				const toBeRemoveItemId = itemId;
				setWarehouseItems(item => item.filter(it => it.id !== toBeRemoveItemId));

				// 3 seconds showing toast
				// after 3 second hide from screen
				formState.setSuccess({ message: `${itemName} removed` });
				setTimeout(() => formState.setState({ success: false }), 5000);
			}
		} catch (err) {
			const error = err as Error;
			console.error(`[ERROR] ${error.message}`);
			formState.setError({ message: `Unexpected error: ${error.message}` });
		} finally {
			formState.setFormLoading(false);
		}
	}

	useEffect(() => {
		if (selectedTenant === undefined) return;
		getData(pagination.current!, pagination.pageSize!, search);
	}, [selectedTenant, search]);

	/*
			useEffect setMounted will Prevent hydration
		*/
	useEffect(() => setIsMounted(true), []);
	if (!isMounted || isUseTenantLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} items`} />;

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${formState.state.isSuccess ? 'show' : ''} colored-toast bg-success-transparent`}
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

			<div className="card table-list-card">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
						<Input.Search
							placeholder="Search items..."
							allowClear
							className="me-2 flex-grow-1"
							onSearch={value => {
								setSearch(value);
								setPagination(prev => ({ ...prev, current: 1 })); // reset to page 1
							}}
						/>
						<div className="dropdown me-2">
							<Link
								href="#"
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								Product
							</Link>
							<ul className="dropdown-menu  dropdown-menu-end p-3">
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Lenovo IdeaPad 3
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Beats Pro{' '}
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Nike Jordan
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Apple Series 5 Watch
									</Link>
								</li>
							</ul>
						</div>
						<CategoryDropdown />
						{/* <div className="dropdown me-2">
						<Link
							href="#"
							className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
							data-bs-toggle="dropdown"
						>
							Brand
						</Link>
						<ul className="dropdown-menu  dropdown-menu-end p-3">
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Lenovo
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Beats
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Nike
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Apple
								</Link>
							</li>
						</ul>
					</div> */}
						{/* <div className="dropdown">
						<Link
							href="#"
							className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
							data-bs-toggle="dropdown"
						>
							Sort By : Last 7 Days
						</Link>
						<ul className="dropdown-menu  dropdown-menu-end p-3">
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Recently Added
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Ascending
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Desending
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Last Month
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Last 7 Days
								</Link>
							</li>
						</ul>
					</div> */}
					</div>
				</div>
				<div className="card-body">
					{/* <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control form-control-sm formsearch"
                  />
                  <Link to className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                >
                  <Filter
                    className="filter-icon"
                    onClick={toggleFilterVisibility}
                  />
                  <span onClick={toggleFilterVisibility}>
                    <img
                      src="assets/img/icons/closes.svg"
                      alt="img"
                    />
                  </span>
                </Link>
              </div>
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select
                  className="img-select"
                  classNamePrefix="react-select"
                  options={options}
                  placeholder="14 09 23"
                />
              </div>
            </div> */}
					{/* /Filter */}
					{/* <div
              className={`card${isFilterVisible ? " visible" : ""}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Box className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={productlist}
                            placeholder="Choose Product"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={categorylist}
                            placeholder="Choose Category"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <GitMerge className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={subcategorylist}
                            placeholder="Choose Sub Category"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={brandlist}
                            placeholder="Nike"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <i className="fas fa-money-bill info-img" />

                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={price}
                            placeholder="Price"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Link className="btn btn-filters ms-auto">
                            {" "}
                            <i
                              data-feather="search"
                              className="feather-search"
                            />{" "}
                            Search{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
					{/* /Filter */}
					<div className="table-responsive">
						<Table<Item>
							rowKey={'itemId'}
							columns={columns}
							dataSource={dataSource}
							pagination={pagination}
							loading={{
								spinning: isComponentLoading,
								indicator: <SectionLoading />,
							}}
							onChange={newPagination => getData(newPagination.current!, newPagination.pageSize!, search)}
						/>
					</div>
				</div>
			</div>

			{/* Delete */}
			<div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<i className="ti ti-trash fs-24 text-danger" />
								</span>
								<h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">
									Remove &apos;{currentDeleteModalData?.name}&apos;
								</h4>
								<p className="text-gray-6 mb-0 fs-16">
									Are you sure you want to remove {currentDeleteModalData?.name} ? <br />
									(Removed item will be archived into history)
								</p>
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<button
										type="button"
										data-bs-dismiss="modal"
										className="btn btn-primary fs-13 fw-medium p-2 px-3"
										onClick={() =>
											handleRemoveItem(
												currentDeleteModalData?.name ?? '',
												currentDeleteModalData?.itemId ?? 0,
												data.selectedTenantId
											)
										}
									>
										Yes Remove
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
