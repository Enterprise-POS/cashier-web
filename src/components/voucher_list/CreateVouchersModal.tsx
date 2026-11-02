'use client';

import { FormEvent, useState } from 'react';
import { Trash2 } from 'react-feather';

import {
	CreateVoucherRequest,
	CreatableVoucherType,
	VoucherRoundingPolicy,
} from '@/_interface/VoucherDef';
import { hideBootstrapModal } from '@/_lib/utils';
import { VoucherItemSelector } from '@/components/voucher_list/VoucherItemSelector';

type VoucherDraft = {
	code: string;
	name: string;
	voucher_type: CreatableVoucherType;
	item_id_combinations: number[];
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
	item_id_combinations: [],
	percentage: '',
	maximum_decrement: '',
	rounding_policy: VoucherRoundingPolicy.ROUND,
	decrement: '',
	start_at: '',
	end_at: '',
};

function toTimestamp(value: string): number | undefined {
	if (!value) return undefined;
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? undefined : Math.floor(timestamp / 1000);
}

export function CreateVouchersModal({
	tenantId,
	isLoading,
	onSubmit,
}: {
	tenantId: number;
	isLoading: boolean;
	onSubmit: (payloads: CreateVoucherRequest[]) => Promise<Array<string | null>>;
}) {
	const [drafts, setDrafts] = useState<VoucherDraft[]>([{ ...EMPTY_DRAFT }]);

	function updateDraft<Field extends keyof VoucherDraft>(index: number, field: Field, value: VoucherDraft[Field]) {
		setDrafts(current =>
			current.map((draft, draftIndex) => (draftIndex === index ? { ...draft, [field]: value } : draft)),
		);
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
		} else if (draft.voucher_type === 'FROM_TOTAL_LIMITED_STATIC_DECREMENT') {
			body.decrement = Number(draft.decrement);
		} else {
			body.decrement = Number(draft.decrement);
			body.item_id_combinations = draft.item_id_combinations;
		}
		return body;
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (drafts.some(draft => draft.voucher_type === 'ITEM_COMBINATIONS' && draft.item_id_combinations.length === 0)) {
			return;
		}
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
												disabled={isLoading}
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
												disabled={isLoading}
												onChange={event => updateDraft(index, 'name', event.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label className="form-label">Voucher Type *</label>
											<select
												className="form-select"
												value={draft.voucher_type}
												disabled={isLoading}
												onChange={event =>
													updateDraft(index, 'voucher_type', event.target.value as CreatableVoucherType)
												}
											>
												<option value="FROM_TOTAL_LIMITED_PERCENTAGE">Limited Percentage</option>
												<option value="FROM_TOTAL_LIMITED_STATIC_DECREMENT">Static Decrement</option>
												<option value="ITEM_COMBINATIONS">Item Combinations</option>
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
														disabled={isLoading}
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
														disabled={isLoading}
														onChange={event => updateDraft(index, 'maximum_decrement', event.target.value)}
													/>
												</div>
												<div className="col-md-6 mb-3">
													<label className="form-label">Rounding Policy *</label>
													<select
														className="form-select"
														value={draft.rounding_policy}
														required
														disabled={isLoading}
														onChange={event =>
															updateDraft(index, 'rounding_policy', event.target.value as VoucherRoundingPolicy)
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
													disabled={isLoading}
													onChange={event => updateDraft(index, 'decrement', event.target.value)}
												/>
											</div>
										)}
										{draft.voucher_type === 'ITEM_COMBINATIONS' && (
											<VoucherItemSelector
												tenantId={tenantId}
												selectedItemIds={draft.item_id_combinations}
												disabled={isLoading}
												onChange={itemIds => updateDraft(index, 'item_id_combinations', itemIds)}
											/>
										)}
										<div className="col-md-6 mb-3">
											<label className="form-label">Start At (optional)</label>
											<input
												type="datetime-local"
												className="form-control"
												value={draft.start_at}
												disabled={isLoading}
												onChange={event => updateDraft(index, 'start_at', event.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label className="form-label">End At (optional)</label>
											<input
												type="datetime-local"
												className="form-control"
												value={draft.end_at}
												disabled={isLoading}
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
