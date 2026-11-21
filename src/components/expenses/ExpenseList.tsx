'use client';
import { Alert, ConfigProvider, DatePicker, Popconfirm, Select, Table, TableColumnsType, TableProps, Tooltip } from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Edit, Trash2 } from 'react-feather';

import { ExpenseDef, ExpenseSearchInput, ExpenseSortColumn } from '@/_interface/ExpenseDef';
import { deleteExpense } from '@/_lib/client_expense';
import dayjs from '@/_lib/dayjs';
import { formatIDR } from '@/_lib/utils';
import ExpenseCategoryModal from '@/components/expenses/ExpenseCategoryModal';
import ExpenseFormModal from '@/components/expenses/ExpenseFormModal';
import {
	useExpenseCategoriesQuery,
	useExpensesQuery,
	useInvalidateExpenses,
} from '@/components/expenses/useExpenseQueries';
import { useStore } from '@/components/provider/StoreProvider';
import { useTenant } from '@/components/provider/TenantProvider';
import CollapseIcon from '@/components/tooltip-content/collapse';

const { RangePicker } = DatePicker;
const theme = { token: { colorPrimary: '#fe9f43' } };

// Functions, not values: "today" is computed on click, so a tab left open overnight (or a long-lived server) is never stale
const thisMonth = (): [Dayjs, Dayjs] => [dayjs().startOf('month'), dayjs().endOf('day')];
const datePresets: { label: string; value: () => [Dayjs, Dayjs] }[] = [
	{ label: 'Today', value: () => [dayjs().startOf('day'), dayjs().endOf('day')] },
	{ label: 'This week', value: () => [dayjs().startOf('week'), dayjs().endOf('day')] },
	{ label: 'This month', value: thisMonth },
	{
		label: 'Last month',
		value: () => [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
	},
	{ label: 'This year', value: () => [dayjs().startOf('year'), dayjs().endOf('day')] },
];

export default function ExpenseList({ token }: { token: string }) {
	const { data: tenantCtx } = useTenant();
	const { data: storeCtx } = useStore();
	const tenantId = tenantCtx.selectedTenantId;
	const stores = storeCtx.storeList;

	const [storeId, setStoreId] = useState(0);
	const [categoryId, setCategoryId] = useState(0);
	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(thisMonth);
	const [sort, setSort] = useState<{ column: ExpenseSortColumn; ascending: boolean }>({
		column: 'expense_date',
		ascending: false,
	});
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const [formExpense, setFormExpense] = useState<ExpenseDef | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const invalidate = useInvalidateExpenses();
	// Dates differ between the server (UTC) and the browser (WIB): render the date picker in the browser only
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	const searchInput: ExpenseSearchInput = useMemo(
		() => ({
			store_id: storeId,
			expense_category_id: categoryId,
			limit,
			page,
			filters: [sort],
			// Whole days, end is exclusive at the API
			date_filter: dateRange
				? {
						column: 'expense_date',
						start_date: dateRange[0].startOf('day').unix(),
						end_date: dateRange[1].add(1, 'day').startOf('day').unix(),
					}
				: null,
		}),
		[storeId, categoryId, limit, page, sort, dateRange],
	);

	const expensesQuery = useExpensesQuery(token, tenantId, searchInput);
	const categoriesQuery = useExpenseCategoriesQuery(token, tenantId);
	const categories = categoriesQuery.data ?? [];
	const storeName = (id: number | null) =>
		id === null ? 'Whole business' : (stores.find(s => s.id === id)?.name ?? `Store #${id}`);

	// Any filter change goes back to page 1
	function withPageReset<T>(setter: (v: T) => void) {
		return (v: T) => {
			setter(v);
			setPage(1);
		};
	}

	async function onDelete(expense: ExpenseDef) {
		setActionError(null);
		const { error } = await deleteExpense(tenantId, token, expense.id);
		if (error !== null) return setActionError(error);
		invalidate();
	}

	const onTableChange: TableProps<ExpenseDef>['onChange'] = (pagination, _filters, sorter) => {
		const s = Array.isArray(sorter) ? sorter[0] : sorter;
		if (s?.order && s.columnKey) {
			setSort({ column: s.columnKey as ExpenseSortColumn, ascending: s.order === 'ascend' });
		} else {
			setSort({ column: 'expense_date', ascending: false });
		}
		setLimit(pagination.pageSize ?? 10);
		setPage(pagination.current ?? 1);
	};

	const sortOrder = (column: ExpenseSortColumn) =>
		sort.column === column ? (sort.ascending ? 'ascend' : 'descend') : null;

	const columns: TableColumnsType<ExpenseDef> = [
		{
			title: 'Date',
			key: 'expense_date',
			dataIndex: 'expense_date',
			sorter: true,
			sortOrder: sortOrder('expense_date'),
			render: (v: string) => dayjs(v).format('DD MMM YYYY HH:mm'),
		},
		{
			title: 'Category',
			dataIndex: 'expense_category_name',
			render: (v: string | null) => v ?? <span className="text-muted">Uncategorized</span>,
		},
		{ title: 'Store', dataIndex: 'store_id', render: (v: number | null) => storeName(v) },
		{ title: 'Description', dataIndex: 'description', ellipsis: true },
		{ title: 'Payment', dataIndex: 'payment_type' },
		{
			title: 'Amount',
			key: 'amount',
			dataIndex: 'amount',
			align: 'right',
			sorter: true,
			sortOrder: sortOrder('amount'),
			render: (v: number) => formatIDR(v),
		},
		{
			title: 'Recorded by',
			dataIndex: 'responsible_user_name_snapshot',
			render: (v: string, expense) => (
				<Tooltip
					title={expense.updated_at ? `Last edited ${dayjs(expense.updated_at).format('DD MMM YYYY HH:mm')}` : ''}
				>
					{v}
				</Tooltip>
			),
		},
		{
			title: '',
			key: 'actions',
			render: (_, expense) => (
				<div className="d-flex gap-2">
					<button
						type="button"
						className="btn btn-sm btn-icon"
						aria-label="Edit expense"
						onClick={() => {
							setFormExpense(expense);
							setIsFormOpen(true);
						}}
					>
						<Edit size={16} />
					</button>
					<Popconfirm
						title="Delete this expense?"
						description={`${formatIDR(expense.amount)} · ${dayjs(expense.expense_date).format('DD MMM YYYY')}`}
						okText="Delete"
						okButtonProps={{ danger: true }}
						onConfirm={() => onDelete(expense)}
					>
						<button type="button" className="btn btn-sm btn-icon" aria-label="Delete expense">
							<Trash2 size={16} />
						</button>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<ConfigProvider theme={theme}>
			<div className="page-header">
				<div className="add-item d-flex">
					<div className="page-title">
						<h4 className="fw-bold">Expenses</h4>
						<h6>Track your business spending</h6>
					</div>
				</div>
				<ul className="table-top-head">
					<CollapseIcon />
				</ul>
				<div className="page-btn d-flex gap-2">
					<button
						type="button"
						className="btn btn-secondary"
						disabled={tenantId === 0}
						onClick={() => setIsCategoryOpen(true)}
					>
						<i className="ti ti-settings me-1"></i>
						Manage Categories
					</button>
					<button
						type="button"
						className="btn btn-primary"
						disabled={tenantId === 0}
						onClick={() => {
							setFormExpense(null);
							setIsFormOpen(true);
						}}
					>
						<i className="ti ti-circle-plus me-1"></i>
						Add Expense
					</button>
				</div>
			</div>

			{tenantId === 0 && <Alert type="info" showIcon message="Please choose a tenant first." className="mb-3" />}
			{(actionError || expensesQuery.error) && (
				<Alert
					type="error"
					showIcon
					closable
					className="mb-3"
					message={actionError ?? expensesQuery.error?.message}
					onClose={() => setActionError(null)}
				/>
			)}

			<div className="card">
				<div className="card-body">
					<div className="row g-3 mb-3">
						<div className="col-md-3">
							<label className="form-label">Store</label>
							<Select
								className="w-100"
								value={storeId}
								onChange={withPageReset(setStoreId)}
								options={[
									{ value: 0, label: 'All stores' },
									{ value: -1, label: 'Whole business only' },
									...stores.map(s => ({ value: s.id, label: s.name })),
								]}
							/>
						</div>
						<div className="col-md-3">
							<label className="form-label">Category</label>
							<Select
								className="w-100"
								value={categoryId}
								onChange={withPageReset(setCategoryId)}
								options={[
									{ value: 0, label: 'All categories' },
									{ value: -1, label: 'Uncategorized' },
									...categories.map(c => ({ value: c.id, label: c.name })),
								]}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label">Date</label>
							{!isMounted && <div style={{ height: 32 }} />}
							{isMounted && (
								<RangePicker
									className="w-100"
									value={dateRange}
									presets={datePresets}
									format="DD MMM YYYY"
									onChange={withPageReset((v: [Dayjs | null, Dayjs | null] | null) =>
										setDateRange(v && v[0] && v[1] ? [v[0], v[1]] : null),
									)}
								/>
							)}
						</div>
					</div>

					<div className="d-flex align-items-baseline gap-2 mb-3">
						<span className="text-muted">Total this period:</span>
						<h4 className="mb-0">{formatIDR(expensesQuery.data?.sum_amount ?? 0)}</h4>
						<span className="text-muted">· {expensesQuery.data?.total_count ?? 0} expenses</span>
					</div>

					<Table<ExpenseDef>
						rowKey="id"
						columns={columns}
						dataSource={expensesQuery.data?.expenses ?? []}
						loading={expensesQuery.isFetching}
						onChange={onTableChange}
						scroll={{ x: 'max-content' }}
						pagination={{
							current: page,
							pageSize: limit,
							total: expensesQuery.data?.total_count ?? 0,
							showSizeChanger: true,
							pageSizeOptions: [10, 20, 50, 100],
						}}
						locale={{ emptyText: 'No expenses in this period.' }}
					/>
				</div>
			</div>

			<ExpenseFormModal
				open={isFormOpen}
				expense={formExpense}
				tenantId={tenantId}
				token={token}
				stores={stores}
				defaultStoreId={storeCtx.selectedStoreId}
				categories={categories}
				onClose={() => setIsFormOpen(false)}
			/>
			<ExpenseCategoryModal
				open={isCategoryOpen}
				tenantId={tenantId}
				token={token}
				categories={categories}
				onClose={() => setIsCategoryOpen(false)}
			/>
		</ConfigProvider>
	);
}
