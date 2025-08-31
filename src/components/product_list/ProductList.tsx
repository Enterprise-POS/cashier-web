'use client';
import { Item } from '@/_classes/Item';
import { Tenant } from '@/_classes/Tenant';
import { HTTPResult } from '@/_interface/HTTPResult';
import { ItemDef } from '@/_interface/ItemDef';
import { getWarehouseItem } from '@/_lib/warehouse';
import { all_routes as routes } from '@/components/core/data/all_routes';
import Table from '@/components/pagination/datatable';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Edit, Eye, Trash2 } from 'react-feather';

export default function ProductList({ limit, page }: { limit: number; page: number }) {
	const { data, isStateLoading } = useTenant();
	const [isComponentLoading, setComponentLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Success Toast
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Error Toast
	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	const [warehouseItems, setWarehouseItems] = useState<Item[]>([]);
	const [warehouseItemCount, setWarehouseItemCount] = useState(0);

	const dataSource = warehouseItems;
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
					<Link href={`/${item.itemId}`}>{text}</Link>
				</div>
			),
			sorter: (a: Item, b: Item) => a.itemName.length - b.itemName.length,
		},

		// {
		// 	title: 'Category',
		// 	dataIndex: 'category',
		// 	sorter: (a: any, b: any) => a.category.length - b.category.length,
		// },

		// {
		// 	title: 'Brand',
		// 	dataIndex: 'brand',
		// 	sorter: (a: any, b: any) => a.brand.length - b.brand.length,
		// },
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: (a: Item, b: Item) => a.createdAt.length - b.createdAt.length,
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
			render: () => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link className="me-2 p-2" href={routes.productdetails}>
							<Eye className="feather-view" />
						</Link>
						<Link className="me-2 p-2" href={routes.editproduct}>
							<Edit className="feather-edit" />
						</Link>
						<Link className="confirm-text p-2" href="#" data-bs-toggle="modal" data-bs-target="#delete-modal">
							<Trash2 className="feather-trash-2" />
						</Link>
					</div>
				</div>
			),
			sorter: (a: Item, b: Item) => a.createdAt.length - b.createdAt.length,
		},
	];

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	useEffect(() => {
		async function getData() {
			if (isComponentLoading) return;
			try {
				setComponentLoading(true);
				if (selectedTenant !== undefined) {
					const { result, error }: HTTPResult<{ itemDefs: ItemDef[]; count: number }> = await getWarehouseItem(
						selectedTenant.id,
						limit,
						page
					);
					if (error !== null) {
						//
					} else {
						setWarehouseItems(() => result!.itemDefs.map(itemDef => new Item(itemDef)));
						if (result!.count !== warehouseItemCount) {
							setWarehouseItemCount(result!.count);
						}
					}
				} else {
					//
				}
			} catch (e) {
				const error = e as Error;
				console.error(`[ERROR] ${error.message}`);
			} finally {
				setComponentLoading(false);
			}
		}

		getData();
	}, [selectedTenant]);

	/*
			useEffect setMounted will Prevent hydration
		*/
	useEffect(() => setIsMounted(true), []);
	if (!isMounted || isStateLoading || isComponentLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} items`} />;

	return (
		<div className="card table-list-card">
			<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
				<div className="search-set"></div>
				<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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
					{/* <div className="dropdown me-2">
						<Link
							href="#"
							className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
							data-bs-toggle="dropdown"
						>
							Created By
						</Link>
						<ul className="dropdown-menu  dropdown-menu-end p-3">
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									James Kirwin
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Francis Chang
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Antonio Engle
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Leo Kelly
								</Link>
							</li>
						</ul>
					</div> */}
					<div className="dropdown me-2">
						<Link
							href="#"
							className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
							data-bs-toggle="dropdown"
						>
							Category
						</Link>
						<ul className="dropdown-menu  dropdown-menu-end p-3">
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Computers
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Electronics
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Shoe
								</Link>
							</li>
							<li>
								<Link href="#" className="dropdown-item rounded-1">
									Electronics
								</Link>
							</li>
						</ul>
					</div>
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
					<Table props={dataSource.length.toString()} columns={columns} dataSource={dataSource} />
				</div>
			</div>
		</div>
	);
}
