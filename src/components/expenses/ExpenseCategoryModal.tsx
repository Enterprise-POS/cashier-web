'use client';
import { Alert, Input, InputRef, List, Modal, Popconfirm, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Check, Edit, Trash2, X } from 'react-feather';

import { ExpenseCategoryDef } from '@/_interface/ExpenseDef';
import { createExpenseCategory, deleteExpenseCategory, editExpenseCategory } from '@/_lib/client_expense';
import { useInvalidateExpenses } from '@/components/expenses/useExpenseQueries';

export default function ExpenseCategoryModal({
	open,
	tenantId,
	token,
	categories,
	onClose,
}: {
	open: boolean;
	tenantId: number;
	token: string;
	categories: ExpenseCategoryDef[];
	onClose: () => void;
}) {
	const [newName, setNewName] = useState('');
	const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isBusy, setIsBusy] = useState(false);
	const newNameRef = useRef<InputRef>(null);
	const invalidate = useInvalidateExpenses();

	useEffect(() => {
		if (!open) return;
		setNewName('');
		setEditing(null);
		setError(null);
	}, [open]);

	// Every action: call API, show error or refresh the lists
	async function run(action: () => Promise<{ error: string | null }>, onSuccess?: () => void) {
		setIsBusy(true);
		setError(null);
		const { error } = await action();
		setIsBusy(false);
		// The clicked button was disabled while busy and lost focus, keep focus inside so Esc still closes
		newNameRef.current?.focus();
		if (error !== null) return setError(error);

		invalidate();
		onSuccess?.();
	}

	return (
		<Modal open={open} title="Expense Categories" footer={null} onCancel={onClose}>
			{error && <Alert type="error" message={error} showIcon className="mb-3" />}

			<Space.Compact className="w-100 mb-3">
				<Input
					ref={newNameRef}
					placeholder="New category name"
					value={newName}
					maxLength={100}
					onChange={e => setNewName(e.target.value)}
					onPressEnter={() => run(() => createExpenseCategory(tenantId, token, newName), () => setNewName(''))}
				/>
				<button
					type="button"
					className="btn btn-primary text-nowrap"
					disabled={isBusy || newName.trim() === ''}
					onClick={() => run(() => createExpenseCategory(tenantId, token, newName), () => setNewName(''))}
				>
					+ Add
				</button>
			</Space.Compact>

			<List
				bordered
				locale={{ emptyText: 'No categories yet. Add your first one above.' }}
				dataSource={categories}
				renderItem={category =>
					editing?.id === category.id ? (
						<List.Item
							actions={[
								<button
									key="save"
									type="button"
									className="btn btn-sm btn-icon"
									aria-label="Save"
									disabled={isBusy || editing.name.trim() === ''}
									onClick={() =>
										run(() => editExpenseCategory(tenantId, token, category.id, editing.name), () => setEditing(null))
									}
								>
									<Check size={16} />
								</button>,
								<button
									key="cancel"
									type="button"
									className="btn btn-sm btn-icon"
									aria-label="Cancel"
									onClick={() => setEditing(null)}
								>
									<X size={16} />
								</button>,
							]}
						>
							<Input
								autoFocus
								value={editing.name}
								maxLength={100}
								onChange={e => setEditing({ id: category.id, name: e.target.value })}
							/>
						</List.Item>
					) : (
						<List.Item
							actions={[
								<button
									key="edit"
									type="button"
									className="btn btn-sm btn-icon"
									aria-label={`Rename ${category.name}`}
									onClick={() => setEditing({ id: category.id, name: category.name })}
								>
									<Edit size={16} />
								</button>,
								<Popconfirm
									key="delete"
									title={`Delete '${category.name}'?`}
									description="Its expenses will stay, as Uncategorized."
									okText="Delete"
									okButtonProps={{ danger: true }}
									onConfirm={() => run(() => deleteExpenseCategory(tenantId, token, category.id))}
								>
									<button
										type="button"
										className="btn btn-sm btn-icon"
										aria-label={`Delete ${category.name}`}
										disabled={isBusy}
									>
										<Trash2 size={16} />
									</button>
								</Popconfirm>,
							]}
						>
							{category.name}
						</List.Item>
					)
				}
			/>
		</Modal>
	);
}
