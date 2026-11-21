'use client';
import { Alert, DatePicker, Divider, Form, Input, InputNumber, Modal, Segmented, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { Store } from '@/_classes/Store';
import { ExpenseCategoryDef, ExpenseDef, ExpensePaymentType, ExpensePaymentTypes } from '@/_interface/ExpenseDef';
import { createExpense, createExpenseCategory, editExpense } from '@/_lib/client_expense';
import dayjs from '@/_lib/dayjs';
import { useInvalidateExpenses } from '@/components/expenses/useExpenseQueries';

type FormValues = {
	amount: number;
	expenseDate: Dayjs;
	categoryId: number | null;
	scope: 'business' | 'store';
	storeId: number | null;
	paymentType: ExpensePaymentType;
	description: string;
};

export default function ExpenseFormModal({
	open,
	expense,
	tenantId,
	token,
	stores,
	defaultStoreId,
	categories,
	onClose,
}: {
	open: boolean;
	expense: ExpenseDef | null; // null = add
	tenantId: number;
	token: string;
	stores: Store[];
	defaultStoreId: number; // header's selected store, 0 = none
	categories: ExpenseCategoryDef[];
	onClose: () => void;
}) {
	const [form] = Form.useForm<FormValues>();
	const scope = Form.useWatch('scope', form);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [isAddingCategory, setIsAddingCategory] = useState(false);
	const invalidate = useInvalidateExpenses();

	useEffect(() => {
		if (!open) return;
		setError(null);
		setNewCategoryName('');
		form.resetFields(); // clear validation errors left from the last open
		// New expense: "Store" with the header's selected store. No stores at all: whole business
		const selectedStore = stores.find(s => s.id === defaultStoreId)?.id ?? null;
		form.setFieldsValue({
			amount: expense?.amount,
			expenseDate: expense ? dayjs(expense.expense_date) : dayjs(),
			categoryId: expense?.expense_category_id ?? null,
			scope: expense ? (expense.store_id ? 'store' : 'business') : stores.length > 0 ? 'store' : 'business',
			storeId: expense ? expense.store_id : selectedStore,
			paymentType: expense?.payment_type ?? 'CASH',
			description: expense?.description ?? '',
		});
	}, [open, expense, form]); // only reset when the modal opens, not when stores reload

	async function onAddCategory() {
		if (newCategoryName.trim() === '') return;
		setIsAddingCategory(true);
		const { result, error } = await createExpenseCategory(tenantId, token, newCategoryName);
		setIsAddingCategory(false);
		if (error !== null) return setError(error);

		invalidate();
		form.setFieldValue('categoryId', result!.id);
		setNewCategoryName('');
	}

	async function onSubmit(values: FormValues) {
		setIsSaving(true);
		setError(null);
		const input = {
			expense_id: expense?.id,
			store_id: values.scope === 'store' ? values.storeId : null,
			expense_category_id: values.categoryId ?? null,
			amount: values.amount,
			description: values.description ?? '',
			expense_date: values.expenseDate.unix(),
			payment_type: values.paymentType,
		};
		const { error } = expense ? await editExpense(tenantId, token, input) : await createExpense(tenantId, token, input);
		setIsSaving(false);
		if (error !== null) return setError(error);

		invalidate();
		onClose();
	}

	return (
		<Modal
			open={open}
			title={expense ? 'Edit Expense' : 'Add Expense'}
			okText="Save"
			onOk={() => form.submit()}
			onCancel={onClose}
			confirmLoading={isSaving}
		>
			{error && <Alert type="error" message={error} showIcon className="mb-3" />}
			<Form form={form} layout="vertical" onFinish={onSubmit} requiredMark>
				<Form.Item
					name="amount"
					label="Amount"
					rules={[{ required: true, type: 'number', min: 1, message: 'Amount must be greater than 0' }]}
				>
					<InputNumber<number>
						className="w-100"
						prefix="Rp"
						min={1}
						precision={0}
						formatter={v => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
						parser={v => Number((v ?? '').replace(/\./g, ''))}
					/>
				</Form.Item>

				<Form.Item name="expenseDate" label="Date" rules={[{ required: true }]}>
					<DatePicker className="w-100" showTime={{ format: 'HH:mm' }} format="DD MMM YYYY HH:mm" />
				</Form.Item>

				<Form.Item name="categoryId" label="Category">
					<Select
						allowClear
						placeholder="Uncategorized"
						options={categories.map(c => ({ value: c.id, label: c.name }))}
						popupRender={menu => (
							<>
								{menu}
								<Divider style={{ margin: '8px 0' }} />
								<Space style={{ padding: '0 8px 4px' }}>
									<Input
										placeholder="New category"
										value={newCategoryName}
										maxLength={100}
										onChange={e => setNewCategoryName(e.target.value)}
										onKeyDown={e => e.stopPropagation()}
									/>
									<button
										type="button"
										className="btn btn-sm btn-primary text-nowrap"
										disabled={isAddingCategory || newCategoryName.trim() === ''}
										onClick={onAddCategory}
									>
										+ Add
									</button>
								</Space>
							</>
						)}
					/>
				</Form.Item>

				<Form.Item name="scope" label="For">
					{/* Segmented, not Radio: the global `label span { color: red }` rule paints radio text red */}
					<Segmented
						options={[
							{ label: 'Store', value: 'store' },
							{ label: 'Whole business', value: 'business' },
						]}
					/>
				</Form.Item>
				{scope === 'store' && (
					<Form.Item name="storeId" rules={[{ required: true, message: 'Please choose a store' }]}>
						<Select
							placeholder="Choose store"
							options={stores.map(s => ({ value: s.id, label: s.name }))}
						/>
					</Form.Item>
				)}

				<Form.Item name="paymentType" label="Payment">
					<Select options={ExpensePaymentTypes.map(p => ({ value: p, label: p }))} />
				</Form.Item>

				<Form.Item name="description" label="Description">
					<Input.TextArea rows={3} maxLength={500} showCount />
				</Form.Item>

				{expense && (
					<p className="text-muted fs-12 mb-0">
						Recorded by {expense.responsible_user_name_snapshot}
						{expense.updated_at && ` · edited ${dayjs(expense.updated_at).format('DD MMM YYYY HH:mm')}`}
					</p>
				)}
			</Form>
		</Modal>
	);
}
