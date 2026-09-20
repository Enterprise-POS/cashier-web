'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Input, Pagination, Table, TableColumnsType, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Edit, Trash2 } from 'react-feather';

import { CategoryWithItem } from '@/_classes/Item';
import { Tenant } from '@/_classes/Tenant';
import { StockType } from '@/_interface/ItemDef';
import { formatIDR } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';
import { useProductListStore } from '@/components/store/productListStore';
import type { ProductListSort, ProductListSortColumn } from '@/components/store/productListStore';
import { useProductCategoriesQuery, useProductListQuery } from './useProductListQuery';

export default function ProductList({ limit, page, token }: { limit: number; page: number; token: string }) {
	const queryClient = useQueryClient();
	const { data, isStateLoading: isUseTenantLoading } = useTenant();
	const [isMounted, setIsMounted] = useState(false);
	const [currentDeleteModalData, setCurrentDeleteModalData] = useState<{ itemId: number; name: string } | null>(null);
	const routePaginationRef = useRef<{ page: number; limit: number } | null>(null);

	const pagination = useProductListStore(s => s.pagination);
	const nameQuery = useProductListStore(s => s.nameQuery);
	const selectedCategory = useProductListStore(s => s.selectedCategory);
	const sort = useProductListStore(s => s.sort);
	const isLoading = useProductListStore(s => s.isLoading);
	const isError = useProductListStore(s => s.isError);
	const isSuccess = useProductListStore(s => s.isSuccess);
	const errorMessage = useProductListStore(s => s.errorMessage);
	const successMessage = useProductListStore(s => s.successMessage);

	const setPagination = useProductListStore(s => s.setPagination);
	const setNameQuery = useProductListStore(s => s.setNameQuery);
	const applyTableChange = useProductListStore(s => s.applyTableChange);
	const applyFilters = useProductListStore(s => s.applyFilters);
	const resetFilters = useProductListStore(s => s.resetFilters);
	const clearError = useProductListStore(s => s.clearError);
	const clearSuccess = useProductListStore(s => s.clearSuccess);
	const setError = useProductListStore(s => s.setError);
	const handleRemoveItem = useProductListStore(s => s.handleRemoveItem);

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);
	const tenantId = selectedTenant?.id ?? 0;

	const productListQuery = useProductListQuery(token, tenantId);
	const categoriesQuery = useProductCategoriesQuery(tenantId);
	const products = productListQuery.data?.products ?? [];
	const total = productListQuery.data?.total ?? 0;
	const isTableLoading = isLoading || productListQuery.isFetching;

	const categoryFilters = useMemo(
		() =>
			(categoriesQuery.data ?? []).map(category => ({
				text: category.categoryName,
				value: category.id,
			})),
		[categoriesQuery.data],
	);

	const getSortOrder = (column: ProductListSortColumn) => {
		if (sort?.column !== column) return null;
		return sort.ascending ? 'ascend' : 'descend';
	};

	type TableSorter = Parameters<NonNullable<TableProps<CategoryWithItem>['onChange']>>[2];

	const getSortFromTable = (tableSorter: TableSorter) => {
		const activeSorter = Array.isArray(tableSorter)
			? tableSorter.find(currentSorter => currentSorter.order !== undefined)
			: tableSorter;
		if (!activeSorter?.order) return null;

		const fieldName = Array.isArray(activeSorter.field)
			? activeSorter.field.at(0)?.toString()
			: activeSorter.field?.toString();

		const sortColumnMap: Record<string, ProductListSortColumn> = {
			itemName: 'item_name',
			createdAt: 'created_at',
		};
		const column = fieldName === undefined ? undefined : sortColumnMap[fieldName];
		if (column === undefined) return null;

		return {
			column,
			ascending: activeSorter.order === 'ascend',
		};
	};

	const handleTableChange: TableProps<CategoryWithItem>['onChange'] = (_pagination, filters, tableSorter) => {
		const categoryFilter = filters.categoryId?.at(0);
		const categoryId = Number(categoryFilter ?? 0);
		const categoryName =
			categoryId === 0
				? 'unselected'
				: (categoriesQuery.data?.find(category => category.id === categoryId)?.categoryName ??
					selectedCategory.categoryName);

		applyTableChange({ categoryId, categoryName }, getSortFromTable(tableSorter));
	};

	const columns: TableColumnsType<CategoryWithItem> = [
		{
			title: 'ID',
			dataIndex: 'itemId',
			//sorter: true,
			//sortOrder: getSortOrder('item_id'),
		},
		{
			title: 'Product',
			dataIndex: 'itemName',
			render: (itemName: string, item) => (
				<Tooltip title={itemName}>
					<Link
						href={routes.editProduct
							.replace('<tenantId>', item.tenantId.toString())
							.replace('<itemId>', item.id.toString())}
					>
						{itemName}
					</Link>
				</Tooltip>
			),
			sorter: true,
			sortOrder: getSortOrder('item_name'),
		},
		{
			title: 'Category',
			dataIndex: 'categoryId',
			filters: categoryFilters,
			filterMultiple: false,
			filteredValue: selectedCategory.categoryId === 0 ? null : [selectedCategory.categoryId],
			onFilter: (value, record) => record.categoryId === value,
			render: (_categoryId: number, item) => (item.categoryName.length > 0 ? item.categoryName : '-'),
		},
		{
			title: 'Stocks',
			dataIndex: 'stocks',
		},
		{
			title: 'Base Price',
			dataIndex: 'basePrice',
			render: (basePrice: number) => formatIDR(basePrice),
		},
		{
			title: 'T/U',
			dataIndex: 'stockType',
			render: (stockType: StockType) => (
				<Tooltip
					title={
						<>
							<div>
								<b>T</b> = Tracked / mandatory stock type
							</div>
							<div>
								<b>U</b> = Unlimited supply stock type
							</div>
						</>
					}
				>
					{stockType.at(0)}
				</Tooltip>
			),
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: true,
			sortOrder: getSortOrder('created_at'),
			render: (date: Date) => date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'),
		},
		{
			title: 'Action',
			dataIndex: 'itemId',
			render: (itemId: number, item) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link
							className="me-2 p-2"
							href={routes.editProduct
								.replace('<tenantId>', item.tenantId.toString())
								.replace('<itemId>', itemId.toString())}
						>
							<Edit className="feather-edit" />
						</Link>
						<Link
							className="confirm-text p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							onClick={() =>
								productListQuery.isFetching ? null : setCurrentDeleteModalData({ itemId, name: item.itemName })
							}
						>
							<Trash2 className="feather-trash-2" />
						</Link>
					</div>
				</div>
			),
		},
	];

	useEffect(() => {
		const previousRoutePagination = routePaginationRef.current;
		if (previousRoutePagination?.page === page && previousRoutePagination.limit === limit) return;

		routePaginationRef.current = { page, limit };
		setPagination({ ...pagination, current: page, pageSize: limit });
	}, [limit, page, pagination, setPagination]);

	useEffect(() => {
		if (pagination.total === total) return;
		setPagination({ ...pagination, total });
	}, [pagination, setPagination, total]);

	useEffect(() => {
		if (productListQuery.isError) setError((productListQuery.error as Error).message);
	}, [productListQuery.isError, productListQuery.error, setError]);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted || isUseTenantLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} items`} />;

	return (
		<>
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${isSuccess ? 'show' : ''} colored-toast bg-success-transparent`}
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

			<div className="card table-list-card">
				<div className="card-header gap-3 d-flex align-items-center flex-wrap row-gap-3">
					<div className="search-set">
						<Input.Search
							placeholder="Search items..."
							allowClear
							value={nameQuery}
							onChange={e => setNameQuery(e.target.value)}
							onSearch={applyFilters}
						/>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary w-100 ${isTableLoading ? 'wait' : ''}`}
							type="button"
							disabled={isTableLoading}
							onClick={applyFilters}
						>
							{isTableLoading ? 'Please wait' : 'Search'}
						</button>
					</div>
					<div className="page-btn">
						<button
							className={`btn btn-primary-ghost w-100 ${isTableLoading ? 'disabled' : ''}`}
							type="button"
							disabled={isTableLoading}
							onClick={resetFilters}
						>
							Reset
						</button>
					</div>
				</div>

				<div className="table-responsive">
					<Table<CategoryWithItem>
						rowKey={'itemId'}
						columns={columns}
						dataSource={products}
						pagination={false}
						loading={{
							spinning: isTableLoading,
							indicator: <SectionLoading />,
						}}
						onChange={handleTableChange}
					/>
				</div>

				<div className="d-flex justify-content-center justify-content-md-end py-3 px-3">
					<Pagination
						current={pagination.current}
						pageSize={pagination.pageSize}
						total={pagination.total}
						showSizeChanger={false}
						onChange={(current, pageSize) => {
							setPagination({ ...pagination, current, pageSize });
						}}
					/>
				</div>
			</div>

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
										disabled={isTableLoading}
										onClick={() =>
											handleRemoveItem(
												currentDeleteModalData?.name ?? '',
												currentDeleteModalData?.itemId ?? 0,
												tenantId,
												queryClient,
												productListQuery.isFetching,
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
