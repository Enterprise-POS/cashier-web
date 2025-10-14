'use client';

import { Input, Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
import { useEffect, useOptimistic, useState } from 'react';
import { Edit, Trash2 } from 'react-feather';

import { Category } from '@/_classes/Category';
import { Tenant } from '@/_classes/Tenant';
import { CategoryDef } from '@/_interface/CategoryDef';
import { HTTPResult } from '@/_interface/HTTPResult';
import { getCategories } from '@/_lib/category';
import AddCategory from '@/components/category_list/AddCategory';
import DeleteCategory from '@/components/category_list/DeleteCategory';
import EditCategory from '@/components/category_list/EditCategory';
import { useFormState } from '@/components/hooks/useFormState';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';

export default function CategoryList() {
	// State values
	const { data, isStateLoading: isUseTenantLoading } = useTenant();
	const [isMounted, setIsMounted] = useState(false);

	const [categories, setCategories] = useState<Category[]>([]);
	const [tobeEditedCategory, setTobeEditedCategory] = useState<Category | undefined>();

	const [tobeDeletedCategory, setTobeDeletedCategory] = useState<Category | undefined>();
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10,
		total: 0,
		responsive: true,
	});
	const formState = useFormState();

	// Stateless values
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);
	const dataSource = categories;
	const columns = [
		{
			title: 'Category',
			dataIndex: 'categoryName',
			sorter: (a: Category, b: Category) => a.categoryName.length - b.categoryName.length,
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: (a: Category, b: Category) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (date: Date) => date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
		},
		{
			title: '',
			dataIndex: 'id',
			key: 'id',
			render: (categoryId: number, category: Category) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						<Link
							className="me-2 p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#edit-category"
							onClick={() => setTobeEditedCategory(category)}
						>
							<Edit />
						</Link>
						<Link
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							className="p-2"
							href="#"
							onClick={() => setTobeDeletedCategory(category)}
						>
							<Trash2 />
						</Link>
					</div>
				</div>
			),
		},
	];

	async function getData(page: number, limit: number) {
		if (formState.state.isFormLoading) return;
		formState.setFormLoading(true);

		try {
			if (selectedTenant !== undefined) {
				const { result, error }: HTTPResult<{ categoryDefs: CategoryDef[]; count: number }> = await getCategories(
					selectedTenant.id,
					page,
					limit,
					''
				);
				if (error !== null) {
					formState.setError({ message: error });
				} else {
					setCategories(() => result!.categoryDefs.map(categoryDef => new Category(categoryDef)));
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
			formState.setFormLoading(false);
		}
	}

	useEffect(() => {
		if (selectedTenant === undefined) return;
		getData(pagination.current!, pagination.pageSize!);
	}, [selectedTenant]);

	useEffect(() => setIsMounted(true), []);
	if (!isMounted || isUseTenantLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} categories`} />;

	return (
		<>
			<div className="card table-list-card">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
						<Input.Search placeholder="Search items..." allowClear className="me-2 flex-grow-1" />
						{/* <div className="dropdown me-2">
							<Link
								href="#"
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								Status
							</Link>
							<ul className="dropdown-menu  dropdown-menu-end p-3">
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Active
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Inactive
									</Link>
								</li>
							</ul>
						</div> */}
						{/* <div className="dropdown me-2">
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
						</div> */}
					</div>
				</div>
				<div className="card-body">
					<div className="table-responsive category-table">
						<Table<Category>
							columns={columns}
							dataSource={dataSource}
							pagination={pagination}
							rowKey="id"
							loading={{
								spinning: formState.state.isFormLoading,
								indicator: <SectionLoading />,
							}}
						/>
					</div>
				</div>
			</div>

			<EditCategory
				tenantId={selectedTenant?.id}
				tobeEditedCategory={tobeEditedCategory}
				onEditedCategory={editedCategory =>
					setCategories(prev => prev.map(c => (c.id === editedCategory.id ? editedCategory : c)))
				}
			/>
			<DeleteCategory
				tenantId={selectedTenant?.id}
				tobeDeletedCategory={tobeDeletedCategory}
				onDeletedCategory={id => setCategories(prev => prev.filter(c => c.id !== id))}
			/>
			<AddCategory
				// By assigning key, we don't need to reset AddCategory state such as input state
				key={selectedTenant?.id}
				tenantId={selectedTenant?.id}
				onAddCategory={(newCategory: Category) => setCategories(values => [...values, newCategory])}
			/>
		</>
	);
}
