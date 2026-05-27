'use client';

import { Tenant } from '@/_classes/Tenant';
import { createItems } from '@/_lib/warehouse';
import { useFormState } from '@/components/hooks/useFormState';
import { useTenant } from '@/components/provider/TenantProvider';
import { useCallback, useState } from 'react';
import { PlusCircle, Trash2 } from 'react-feather';

type ProductRow = {
	id: string;
	productName: string;
	stocks: string;
	basePrice: string;
};

function makeRow(): ProductRow {
	return { id: crypto.randomUUID(), productName: '', stocks: '', basePrice: '' };
}

export default function AddProductForm() {
	const formState = useFormState();
	const { data } = useTenant();
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

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

		const tenantId = selectedTenant?.id;
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
			stocks: r.stocks === '' ? 0 : Number(r.stocks),
			base_price: r.basePrice === '' ? 0 : Number(r.basePrice),
		}));

		formState.setFormLoading(true);
		try {
			const { result, error } = await createItems(tenantId, items);
			if (error !== null) {
				formState.setError({ message: error });
			} else {
				const count = (result ?? []).length;
				formState.setSuccess({ message: `${count} product${count > 1 ? 's' : ''} created successfully.` });
				handleClear();
			}
		} catch (e: unknown) {
			console.warn(e);
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
								<th>Product Name <span className="text-danger">*</span></th>
								<th style={{ width: '12rem' }}>Quantity</th>
								<th style={{ width: '14rem' }}>Base Price</th>
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
								<td colSpan={5}>
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
					<button type="button" className="btn btn-secondary" disabled={formState.state.isFormLoading} onClick={handleClear}>
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
