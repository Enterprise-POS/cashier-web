'use client';

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { PlusCircle, Trash2 } from 'react-feather';

import { Tenant } from '@/_classes/Tenant';
import { StockType } from '@/_interface/ItemDef';
import { registerCategory } from '@/_lib/client_category';
import { convertTo } from '@/_lib/utils';
import { createItems } from '@/_lib/warehouse';
import { Constants } from '@/components/core/data/constant';
import { useFormState } from '@/components/hooks/useFormState';
import { useCategoriesQuery } from '@/components/product_list/useProductListQuery';
import { useTenant } from '@/components/provider/TenantProvider';
import { RegisterCategory } from '@/_interface/RequestBody.js';

type ProductRow = {
	id: string;
	productName: string;
	stocks: string;
	basePrice: string;
	stockType: StockType;
	categoryId: string;
};

function makeRow(): ProductRow {
	return {
		id: crypto.randomUUID(),
		productName: '',
		stocks: '',
		basePrice: '',
		categoryId: 'none',
		stockType: StockType.TRACKED,
	};
}

export default function AddProductForm({ token }: { token: string }) {
	const formState = useFormState();
	const { data } = useTenant();
	const queryClient: QueryClient = useQueryClient();

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);
	const tenantId = selectedTenant?.id ?? 0;

	// Get cached query if available, if not immediately fetch it
	const categoriesQuery = useCategoriesQuery(tenantId);

	const [rows, setRows] = useState<ProductRow[]>(() => [makeRow()]);

	const addRow = useCallback(() => setRows(prev => [...prev, makeRow()]), []);

	const removeRow = useCallback((id: string) => {
		setRows(prev => (prev.length === 1 ? prev : prev.filter(r => r.id !== id)));
	}, []);

	const updateRow = useCallback((id: string, field: keyof Omit<ProductRow, 'id'>, value: string) => {
		setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
	}, []);

	const handleClear = useCallback(() => setRows([makeRow()]), []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formState.state.isFormLoading) return;

		if (!tenantId) {
			formState.setError({ message: 'No tenant selected.' });
			return;
		}

		for (let i = 0; i < rows.length; i++) {
			if (rows[i].productName.trim() === '') {
				formState.setError({ message: `Row ${i + 1}: Product name is required.` });
				return;
			}
		}

		const items = rows.map(r => ({
			item_name: r.productName.trim(),
			stocks: convertTo.number(r.stocks),
			base_price: convertTo.number(r.basePrice),
			stock_type: r.stockType,
			category_id: convertTo.number(r.categoryId),
		}));

		formState.setFormLoading(true);
		try {
			const { result: createItemsRes, error: createItemsErr } = await createItems(tenantId, items);

			if (createItemsErr !== null || createItemsRes === null) {
				formState.setError({ message: createItemsErr ?? 'Failed to create products.' });
				return;
			}

			if (createItemsRes.length !== rows.length) {
				console.error('createItems response length mismatch', { expected: rows.length, got: createItemsRes.length });
				formState.setError({ message: 'Unexpected response from server while creating products.' });
				return;
			}

			const tobeRegisterCategory: RegisterCategory = { tobe_registers: [] };
			rows.forEach((row, i) => {
				const categoryId = convertTo.number(row.categoryId);
				if (categoryId > 0) {
					const { item_id } = createItemsRes[i];
					tobeRegisterCategory.tobe_registers.push({ item_id, category_id: categoryId });
				}
			});

			let categoryWarning: string | null = null;
			if (tobeRegisterCategory.tobe_registers.length > 0) {
				const { error: registerCategoryErr } = await registerCategory(tenantId, token, tobeRegisterCategory);
				if (registerCategoryErr !== null) {
					categoryWarning = ` (category assignment failed: ${registerCategoryErr})`;
				}
			}

			const count = createItemsRes.length;
			formState.setSuccess({
				message: `${count} product${count > 1 ? 's' : ''} created successfully.${categoryWarning ?? ''}`,
			});
			handleClear();

			queryClient.refetchQueries({ queryKey: [Constants.ReactQueryKey.productList] });
		} catch (e: unknown) {
			const error = e as Error;
			console.error(error);
			formState.setError({ message: error.message ?? 'Unexpected error while creating products.' });
		} finally {
			formState.setFormLoading(false);
		}
	};

	return (
		<>
			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${formState.state.isSuccess ? 'show' : ''} colored-toast bg-success-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Success!</strong>
						<button type="button" className="btn-close" onClick={() => formState.setState({ success: false })} />
					</div>
					<div className="toast-body">{formState.value.successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					className={`toast ${formState.state.isError ? 'show' : ''} colored-toast bg-danger-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button type="button" className="btn-close" onClick={() => formState.setState({ error: false })} />
					</div>
					<div className="toast-body">{formState.value.errorMessage}</div>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="table-responsive mb-3">
					<table className="table table-bordered align-middle">
						<thead className="table-light">
							<tr>
								<th style={{ width: '3rem' }}>No</th>
								<th>
									Product Name <span className="text-danger">*</span>
								</th>
								<th style={{ width: '12rem' }}>Quantity</th>
								<th style={{ width: '14rem' }}>Base Price</th>
								<th style={{ width: '14rem' }}>Category</th>
								<th style={{ width: '14rem' }}>Stock Type</th>
								<th style={{ width: '4rem' }}></th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								<tr key={row.id}>
									<td className="text-center text-muted">{index + 1}</td>
									<td>
										<input
											type="text"
											className="form-control form-control-sm"
											value={row.productName}
											placeholder="Product name"
											disabled={formState.state.isFormLoading}
											onChange={e => updateRow(row.id, 'productName', e.target.value)}
										/>
									</td>
									<td>
										<input
											type="number"
											className="form-control form-control-sm"
											value={row.stocks}
											placeholder="0"
											min={0}
											disabled={formState.state.isFormLoading}
											onChange={e => updateRow(row.id, 'stocks', e.target.value)}
										/>
									</td>
									<td>
										<input
											type="number"
											className="form-control form-control-sm"
											value={row.basePrice}
											placeholder="0"
											min={0}
											disabled={formState.state.isFormLoading}
											onChange={e => updateRow(row.id, 'basePrice', e.target.value)}
										/>
									</td>
									<td>
										<select
											className="form-select form-select-sm"
											disabled={formState.state.isFormLoading || categoriesQuery.isError}
											value={row.categoryId}
											onChange={e => updateRow(row.id, 'categoryId', e.target.value)}
										>
											<option className="text-gray" value={'none'}>
												-
											</option>
											{categoriesQuery.data?.map(category => (
												<option key={category.id} className="text-gray" value={category.id}>
													{category.categoryName}
												</option>
											))}
										</select>
									</td>
									<td>
										<select
											className="form-select form-select-sm"
											disabled={formState.state.isFormLoading}
											value={row.stockType}
											onChange={e => updateRow(row.id, 'stockType', e.target.value)}
										>
											<option className="text-gray" value={StockType.TRACKED}>
												(T) Tracked
											</option>
											<option className="text-gray" value={StockType.UNLIMITED}>
												(U) Unlimited
											</option>
										</select>
									</td>
									<td className="text-center">
										<button
											type="button"
											className="btn btn-sm btn-outline-danger"
											disabled={rows.length === 1 || formState.state.isFormLoading}
											onClick={() => removeRow(row.id)}
											title="Remove row"
										>
											<Trash2 size={14} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={7}>
									<button
										type="button"
										className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
										disabled={formState.state.isFormLoading}
										onClick={addRow}
									>
										<PlusCircle size={14} />
										Add Row
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div className="d-flex align-items-center justify-content-end mb-4 gap-2">
					<button
						type="button"
						className="btn btn-secondary"
						disabled={formState.state.isFormLoading}
						onClick={handleClear}
					>
						Clear
					</button>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={formState.state.isFormLoading}
						style={{ cursor: formState.state.isFormLoading ? 'progress' : 'pointer' }}
					>
						{formState.state.isFormLoading ? (
							<>
								<span className="spinner-border spinner-border-sm me-1" role="status" />
								Submitting...
							</>
						) : (
							`Add ${rows.length} Product${rows.length > 1 ? 's' : ''}`
						)}
					</button>
				</div>
			</form>
		</>
	);
}
