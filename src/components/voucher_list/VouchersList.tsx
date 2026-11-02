'use client';

import { Alert, ConfigProvider, Table, TablePaginationConfig, TableProps, Tooltip } from 'antd';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Edit, Trash2 } from 'react-feather';

import { Voucher } from '@/_classes/Voucher';
import {
	CreateVoucherRequest,
	CreatableVoucherType,
	EditVoucherRequest,
	VoucherRoundingPolicy,
	VoucherType,
} from '@/_interface/VoucherDef';
import { hideBootstrapModal } from '@/_lib/utils';
import { useVoucherMutations } from '@/components/voucher_list/useVoucherMutations';
import { useVouchersQuery } from '@/components/voucher_list/useVouchersQuery';
import { useTenant } from '@/components/provider/TenantProvider';
import { useVoucherStore, VoucherSortColumn, VoucherSortOrder } from '@/components/store/voucherStore';
import SectionLoading from '@/components/partials/SectionLoading';

type VoucherDraft = {
	code: string;
	name: string;
	voucher_type: CreatableVoucherType;
	percentage: string;
	maximum_decrement: string;
	rounding_policy: VoucherRoundingPolicy;
	decrement: string;
	start_at: string;
	end_at: string;
};

const EMPTY_DRAFT: VoucherDraft = {
	code: '',
	name: '',
	voucher_type: 'FROM_TOTAL_LIMITED_PERCENTAGE',
	percentage: '',
	maximum_decrement: '',
	rounding_policy: VoucherRoundingPolicy.ROUND,
	decrement: '',
	start_at: '',
	end_at: '',
};

const VOUCHER_TYPE_FILTERS: Array<{ text: string; value: VoucherType }> = [
	{ text: 'Limited percentage', value: 'FROM_TOTAL_LIMITED_PERCENTAGE' },
	{ text: 'Static decrement', value: 'FROM_TOTAL_LIMITED_STATIC_DECREMENT' },
	{ text: 'Item combinations', value: 'ITEM_COMBINATIONS' },
	{ text: 'Item quantities', value: 'ITEM_QUANTITIES' },
];

function toDateTimeInput(timestamp?: string | number | null): string {
	if (timestamp == null || timestamp === '') return '';
	const normalized = typeof timestamp === 'number' && timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
	const date = new Date(normalized);
	if (Number.isNaN(date.getTime())) return '';
	return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toTimestamp(value: string): number | undefined {
	if (!value) return undefined;
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? undefined : Math.floor(timestamp / 1000);
}

function formatDate(value: Date | null | undefined): string {
	return value ? `${value.toLocaleDateString()} ${value.toLocaleTimeString()}` : '--not set';
}

function formatOptionalValue(value: string | number | null | undefined): string | number {
	return value === null || value === undefined || value === '' || value === 0 ? '--not set' : value;
}

function renderTruncatedText(value: string | null | undefined, maxWidth: number | string = 220) {
	if (!value) return '--not set';
	return (
		<Tooltip title={value}>
			<span className="d-inline-block text-truncate align-middle" style={{ maxWidth, verticalAlign: 'bottom' }}>
				{value}
			</span>
		</Tooltip>
	);
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function VouchersList() {
	const tenantContext = useTenant();
	const tenantId = tenantContext.data.selectedTenantId;
	const token = tenantContext.getToken();
	const query = useVouchersQuery(tenantId, token);
	const { createMutation, editMutation, deleteMutation } = useVoucherMutations(tenantId, token);

	const pagination = useVoucherStore(state => state.pagination);
	const voucherType = useVoucherStore(state => state.voucherType);
	const sortColumn = useVoucherStore(state => state.sortColumn);
	const sortOrder = useVoucherStore(state => state.sortOrder);
	const setPagination = useVoucherStore(state => state.setPagination);
	const setVoucherType = useVoucherStore(state => state.setVoucherType);
	const setSort = useVoucherStore(state => state.setSort);
	const errorMessage = useVoucherStore(state => state.errorMessage);
	const successMessage = useVoucherStore(state => state.successMessage);
	const setError = useVoucherStore(state => state.setError);
	const setSuccess = useVoucherStore(state => state.setSuccess);
	const clearFeedback = useVoucherStore(state => state.clearFeedback);

	const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>();
	const [deletingVoucher, setDeletingVoucher] = useState<Voucher | undefined>();

	useEffect(() => {
		if (!query.data || pagination.total === query.data.count) return;
		setPagination({ ...pagination, total: query.data.count });
	}, [query.data?.count, pagination, setPagination]);

	const columns = useMemo<NonNullable<TableProps<Voucher>['columns']>>(
		() => [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
				render: (value: number) => formatOptionalValue(value),
			},
			{
				title: 'Code',
				dataIndex: 'code',
				key: 'code',
				sorter: true,
				sortOrder: sortColumn === 'code' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
				render: (value: string) => renderTruncatedText(value, 140),
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				sorter: true,
				sortOrder: sortColumn === 'name' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
				render: (value: string) => renderTruncatedText(value, 220),
			},
			{
				title: 'Type',
				dataIndex: 'voucherType',
				key: 'voucher_type',
				filters: VOUCHER_TYPE_FILTERS,
				filterMultiple: false,
				filteredValue: voucherType ? [voucherType] : null,
				filterResetToDefaultFilteredValue: false,
				render: (voucherType: VoucherType) => {
					switch (voucherType) {
						case 'FROM_TOTAL_LIMITED_PERCENTAGE':
							return 'Limited Percentage';
						case 'FROM_TOTAL_LIMITED_STATIC_DECREMENT':
							return 'Static Decrement';
						case 'ITEM_COMBINATIONS':
							return 'Item Combinations';
						case 'ITEM_QUANTITIES':
							return 'Item Quantities';
					}
				},
			},
			{
				title: 'Used count',
				dataIndex: 'usedCount',
				key: 'used_count',
			},
			{
				title: 'Usage limit',
				dataIndex: 'usageLimit',
				key: 'usage_limit',
			},
			{
				title: 'Start at',
				dataIndex: 'startAt',
				key: 'start_at',
				render: formatDate,
			},
			{
				title: 'End at',
				dataIndex: 'endAt',
				key: 'end_at',
				render: formatDate,
			},
			{
				title: 'Percentage',
				dataIndex: 'percentage',
				key: 'percentage',
				render: (value: number) => (value === 0 ? '--not set' : `${value}%`),
			},
			{
				title: 'Maximum decrement',
				dataIndex: 'maximumDecrement',
				key: 'maximum_decrement',
				render: (value: number) => formatOptionalValue(value),
			},
			{
				title: 'Rounding policy',
				dataIndex: 'roundingPolicy',
				key: 'rounding_policy',
				render: (value: string) => renderTruncatedText(value, 120),
			},
			{
				title: 'Decrement',
				dataIndex: 'decrement',
				key: 'decrement',
				render: (value: number) => formatOptionalValue(value),
			},
			{
				title: 'Item ID combinations',
				dataIndex: 'itemIdCombinations',
				key: 'item_id_combinations',
				render: (value: number[] | null | undefined) =>
					renderTruncatedText(value?.join(', '), 180),
			},
			{
				title: 'Item quantities',
				dataIndex: 'itemQuantities',
				key: 'item_quantities',
				render: (value: number) => formatOptionalValue(value),
			},
			{
				title: 'Created at',
				dataIndex: 'createdAt',
				key: 'created_at',
				sorter: true,
				sortOrder: sortColumn === 'created_at' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
				render: formatDate,
			},
			{
				title: '',
				key: 'actions',
				width: 110,
				render: (_value, voucher) => (
					<div className="action-table-data">
						<div className="edit-delete-action">
							<Link
								className="me-2 p-2"
								href="#"
								data-bs-toggle="modal"
								data-bs-target="#edit-voucher"
								aria-label={`Edit ${voucher.code}`}
								onClick={event => {
									event.preventDefault();
									clearFeedback();
									setEditingVoucher(voucher);
								}}
							>
								<Edit size={16} />
							</Link>
							<Link
								className="p-2"
								href="#"
								data-bs-toggle="modal"
								data-bs-target="#delete-voucher"
								aria-label={`Delete ${voucher.code}`}
								onClick={event => {
									event.preventDefault();
									clearFeedback();
									setDeletingVoucher(voucher);
								}}
							>
								<Trash2 size={16} />
							</Link>
						</div>
					</div>
				),
			},
		],
		[clearFeedback, sortColumn, sortOrder, voucherType],
	);

	const handleTableChange: TableProps<Voucher>['onChange'] = (nextPagination: TablePaginationConfig, filters, sorter) => {
		const voucherTypeFilter = filters.voucher_type;
		const hasVoucherTypeFilterChange = voucherTypeFilter !== undefined;
		const selectedType = voucherTypeFilter?.[0];
		const nextVoucherType = VOUCHER_TYPE_FILTERS.find(option => option.value === selectedType)?.value ?? null;
		const didVoucherTypeChange = hasVoucherTypeFilterChange && nextVoucherType !== voucherType;
		const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
		const field = activeSorter.columnKey;
		const order = activeSorter.order;
		const allowedColumns: VoucherSortColumn[] = ['code', 'created_at', 'name'];
		const nextColumn =
			typeof field === 'string' && allowedColumns.includes(field as VoucherSortColumn)
				? (field as VoucherSortColumn)
				: null;
		const nextOrder: VoucherSortOrder | null =
			order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : null;

		setSort(nextColumn, nextOrder);
		if (didVoucherTypeChange) setVoucherType(nextVoucherType);
		setPagination({
			...pagination,
			current: didVoucherTypeChange ? 1 : (nextPagination.current ?? 1),
			pageSize: 20,
			total: query.data?.count ?? 0,
		});
	};

	async function handleCreateVouchers(payloads: CreateVoucherRequest[]): Promise<Array<string | null>> {
		clearFeedback();
		if (tenantId === 0) {
			const error = 'Select a tenant before creating vouchers.';
			setError(error);
			return payloads.map(() => error);
		}
		if (payloads.some(voucher => voucher.code.trim() === '' || voucher.name.trim() === '')) {
			const error = 'Voucher code and name are required.';
			setError(error);
			return payloads.map(() => error);
		}

		const results = await Promise.allSettled(payloads.map(body => createMutation.mutateAsync({ body })));
		const errors = results.map(result => (result.status === 'rejected' ? getErrorMessage(result.reason) : null));
		const successfulCount = results.length - errors.filter(Boolean).length;
		if (successfulCount > 0) {
			setSuccess(`${successfulCount} voucher${successfulCount === 1 ? '' : 's'} created successfully.`);
		}
		const failures = errors
			.map((error, index) => (error ? `Voucher ${index + 1} (${payloads[index].code}): ${error}` : null))
			.filter((error): error is string => error !== null);
		if (failures.length > 0) setError(`${successfulCount > 0 ? `${successfulCount} created. ` : ''}${failures.join(' ')}`);
		return errors;
	}

	async function handleEditVoucher(voucher: Voucher, body: EditVoucherRequest) {
		clearFeedback();
		try {
			await editMutation.mutateAsync({ voucherId: voucher.id, body });
			hideBootstrapModal('#edit-voucher');
		} catch (error) {
			setError(getErrorMessage(error));
		}
	}

	async function handleDeleteVoucher(voucher: Voucher) {
		clearFeedback();
		try {
			await deleteMutation.mutateAsync({ voucherId: voucher.id });
			hideBootstrapModal('#delete-voucher');
		} catch (error) {
			setError(getErrorMessage(error));
		}
	}

	if (tenantContext.isStateLoading) return <SectionLoading caption="Loading vouchers" />;

	return (
		<>
			{tenantId === 0 && (
				<Alert className="mb-3" type="info" showIcon message="Select a tenant to view and manage vouchers." />
			)}
			{(errorMessage || query.isError) && (
				<Alert
					className="mb-3"
					type="error"
					showIcon
					message={errorMessage || getErrorMessage(query.error)}
					closable
					onClose={clearFeedback}
					style={errorMessage ? { position: 'fixed', top: 20, right: 20, zIndex: 2000, maxWidth: 520 } : undefined}
				/>
			)}
			{successMessage && (
				<Alert
					className="mb-3"
					type="success"
					showIcon
					message={successMessage}
					closable
					onClose={clearFeedback}
					style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, maxWidth: 520 }}
				/>
			)}
			<div className="card table-list-card">
				<div className="table-responsive">
					<ConfigProvider theme={{ token: { colorPrimary: '#fe9f43' } }}>
						<Table<Voucher>
							columns={columns}
							dataSource={query.data?.vouchers ?? []}
							rowKey="id"
							scroll={{ x: 'max-content' }}
							pagination={{ ...pagination, pageSize: 20 }}
							onChange={handleTableChange}
							loading={{ spinning: query.isFetching, indicator: <SectionLoading /> }}
						/>
					</ConfigProvider>
				</div>
			</div>

			<CreateVouchersModal
				tenantId={tenantId}
				isLoading={createMutation.isPending}
				onSubmit={handleCreateVouchers}
			/>
			<EditVoucherModal
				voucher={editingVoucher}
				isLoading={editMutation.isPending}
				onSubmit={handleEditVoucher}
			/>
			<DeleteVoucherModal
				voucher={deletingVoucher}
				isLoading={deleteMutation.isPending}
				onConfirm={handleDeleteVoucher}
			/>
		</>
	);
}

function CreateVouchersModal({
	tenantId,
	isLoading,
	onSubmit,
}: {
	tenantId: number;
	isLoading: boolean;
	onSubmit: (payloads: CreateVoucherRequest[]) => Promise<Array<string | null>>;
}) {
	const [drafts, setDrafts] = useState<VoucherDraft[]>([{ ...EMPTY_DRAFT }]);

	function updateDraft(index: number, field: keyof VoucherDraft, value: string) {
		setDrafts(current => current.map((draft, draftIndex) => (draftIndex === index ? { ...draft, [field]: value } : draft)));
	}

	function toRequest(draft: VoucherDraft): CreateVoucherRequest {
		const body: CreateVoucherRequest = {
			code: draft.code.trim(),
			name: draft.name.trim(),
			tenant_id: tenantId,
			voucher_type: draft.voucher_type,
		};
		const startAt = toTimestamp(draft.start_at);
		const endAt = toTimestamp(draft.end_at);
		if (startAt !== undefined) body.start_at = startAt;
		if (endAt !== undefined) body.end_at = endAt;

		if (draft.voucher_type === 'FROM_TOTAL_LIMITED_PERCENTAGE') {
			body.percentage = Number(draft.percentage);
			body.maximum_decrement = Number(draft.maximum_decrement);
			body.rounding_policy = draft.rounding_policy;
		} else {
			body.decrement = Number(draft.decrement);
		}
		return body;
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const results = await onSubmit(drafts.map(toRequest));
		const failedDrafts = drafts.filter((_, index) => results[index] !== null);
		if (failedDrafts.length === 0) {
			setDrafts([{ ...EMPTY_DRAFT }]);
			hideBootstrapModal('#add-vouchers');
		} else {
			setDrafts(failedDrafts);
		}
	}

	return (
		<div className="modal fade" id="add-vouchers" tabIndex={-1}>
			<div className="modal-dialog modal-dialog-centered modal-xl">
				<div className="modal-content">
					<form onSubmit={submit}>
						<div className="modal-header">
							<div className="page-title">
								<h4>Add Vouchers</h4>
								<p className="mb-0 text-muted">Create up to 5 vouchers per submission.</p>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							{drafts.map((draft, index) => (
								<div className="border rounded p-3 mb-3" key={index}>
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h6 className="mb-0">Voucher {index + 1}</h6>
										{drafts.length > 1 && (
											<button
												type="button"
												className="btn btn-sm btn-outline-danger"
												disabled={isLoading}
												onClick={() => setDrafts(current => current.filter((_, i) => i !== index))}
											>
												<Trash2 size={14} />
											</button>
										)}
									</div>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label className="form-label">Code *</label>
											<input
												className="form-control"
												value={draft.code}
												required
												maxLength={100}
												onChange={event => updateDraft(index, 'code', event.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label className="form-label">Name *</label>
											<input
												className="form-control"
												value={draft.name}
												required
												maxLength={255}
												onChange={event => updateDraft(index, 'name', event.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label className="form-label">Voucher Type *</label>
											<select
												className="form-select"
												value={draft.voucher_type}
												onChange={event =>
													updateDraft(index, 'voucher_type', event.target.value as CreatableVoucherType)
												}
											>
												<option value="FROM_TOTAL_LIMITED_PERCENTAGE">Limited Percentage</option>
												<option value="FROM_TOTAL_LIMITED_STATIC_DECREMENT">Static Decrement</option>
											</select>
										</div>
										{draft.voucher_type === 'FROM_TOTAL_LIMITED_PERCENTAGE' ? (
											<>
												<div className="col-md-3 mb-3">
													<label className="form-label">Percentage *</label>
													<input
														type="number"
														className="form-control"
														min="0.01"
														max="100"
														step="any"
														value={draft.percentage}
														required
														onChange={event => updateDraft(index, 'percentage', event.target.value)}
													/>
												</div>
												<div className="col-md-3 mb-3">
													<label className="form-label">Maximum Decrement *</label>
													<input
														type="number"
														className="form-control"
														min="0.01"
														step="any"
														value={draft.maximum_decrement}
														required
														onChange={event => updateDraft(index, 'maximum_decrement', event.target.value)}
													/>
												</div>
												<div className="col-md-6 mb-3">
													<label className="form-label">Rounding Policy *</label>
													<select
														className="form-select"
														value={draft.rounding_policy}
														required
														onChange={event =>
															updateDraft(
																index,
																'rounding_policy',
																event.target.value as VoucherRoundingPolicy,
															)
														}
													>
														<option value={VoucherRoundingPolicy.CEIL}>CEIL</option>
														<option value={VoucherRoundingPolicy.ROUND}>ROUND</option>
														<option value={VoucherRoundingPolicy.FLOOR}>FLOOR</option>
													</select>
												</div>
											</>
										) : (
											<div className="col-md-6 mb-3">
												<label className="form-label">Decrement *</label>
												<input
													type="number"
													className="form-control"
													min="0.01"
													step="any"
													value={draft.decrement}
													required
													onChange={event => updateDraft(index, 'decrement', event.target.value)}
												/>
											</div>
										)}
										<div className="col-md-6 mb-3">
											<label className="form-label">Start At (optional)</label>
											<input
												type="datetime-local"
												className="form-control"
												value={draft.start_at}
												onChange={event => updateDraft(index, 'start_at', event.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label className="form-label">End At (optional)</label>
											<input
												type="datetime-local"
												className="form-control"
												value={draft.end_at}
												onChange={event => updateDraft(index, 'end_at', event.target.value)}
											/>
										</div>
									</div>
								</div>
							))}
							{drafts.length < 5 && (
								<button
									type="button"
									className="btn btn-sm btn-outline-primary"
									disabled={isLoading}
									onClick={() => setDrafts(current => [...current, { ...EMPTY_DRAFT }])}
								>
									<i className="ti ti-circle-plus me-1"></i>
									Add another voucher ({drafts.length}/5)
								</button>
							)}
						</div>
						<div className="modal-footer gap-2">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={isLoading}>
								Cancel
							</button>
							<button type="submit" className="btn btn-primary" disabled={isLoading}>
								{isLoading ? 'Creating…' : `Create ${drafts.length} Voucher${drafts.length > 1 ? 's' : ''}`}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

function EditVoucherModal({
	voucher,
	isLoading,
	onSubmit,
}: {
	voucher?: Voucher;
	isLoading: boolean;
	onSubmit: (voucher: Voucher, body: EditVoucherRequest) => Promise<void>;
}) {
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [startAt, setStartAt] = useState('');
	const [endAt, setEndAt] = useState('');

	useEffect(() => {
		if (!voucher) return;
		setName(voucher.name);
		setCode(voucher.code);
		setStartAt(toDateTimeInput(voucher.startAt?.toISOString()));
		setEndAt(toDateTimeInput(voucher.endAt?.toISOString()));
	}, [voucher]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!voucher) return;
		await onSubmit(voucher, {
			name: name.trim(),
			code: code.trim(),
			start_at: toTimestamp(startAt) ?? null,
			end_at: toTimestamp(endAt) ?? null,
		});
	}

	return (
		<div className="modal fade" id="edit-voucher" tabIndex={-1}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<form onSubmit={submit}>
						<div className="modal-header">
							<div className="page-title">
								<h4>Edit Voucher</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label className="form-label">Code *</label>
								<input className="form-control" value={code} required maxLength={100} onChange={e => setCode(e.target.value)} />
							</div>
							<div className="mb-3">
								<label className="form-label">Name *</label>
								<input
									className="form-control"
									value={name}
									required
									maxLength={255}
									onChange={e => setName(e.target.value)}
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">Voucher Type</label>
								<input className="form-control" value={voucher?.voucherType ?? ''} readOnly />
								<small className="text-muted">Voucher type cannot be changed after creation.</small>
							</div>
							<div className="mb-3">
								<label className="form-label">Start At</label>
								<input
									type="datetime-local"
									className="form-control"
									value={startAt}
									onChange={e => setStartAt(e.target.value)}
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">End At</label>
								<input
									type="datetime-local"
									className="form-control"
									value={endAt}
									onChange={e => setEndAt(e.target.value)}
								/>
							</div>
						</div>
						<div className="modal-footer gap-2">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={isLoading}>
								Cancel
							</button>
							<button type="submit" className="btn btn-primary" disabled={isLoading || !voucher}>
								{isLoading ? 'Saving…' : 'Save Changes'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

function DeleteVoucherModal({
	voucher,
	isLoading,
	onConfirm,
}: {
	voucher?: Voucher;
	isLoading: boolean;
	onConfirm: (voucher: Voucher) => Promise<void>;
}) {
	return (
		<div className="modal fade" id="delete-voucher" tabIndex={-1}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="page-wrapper-new p-0">
						<div className="p-5 px-3 text-center">
							<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
								<i className="ti ti-trash fs-24 text-danger" />
							</span>
							<h4 className="fs-20 fw-bold mb-2 mt-1">Delete voucher?</h4>
							<p className="mb-0 fs-16">
								This action is irreversible. Are you sure you want to delete <em>{voucher?.code ?? ''}</em>?
							</p>
							<div className="modal-footer-btn mt-3 d-flex justify-content-center">
								<button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal" disabled={isLoading}>
									No
								</button>
								<button
									type="button"
									className="btn btn-danger"
									disabled={isLoading || !voucher}
									onClick={() => voucher && onConfirm(voucher)}
								>
									{isLoading ? 'Deleting…' : 'Yes, delete'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
