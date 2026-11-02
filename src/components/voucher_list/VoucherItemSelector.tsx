import { Alert, Input, InputNumber, Pagination } from 'antd';
import { useState } from 'react';

import { ItemDef, StockType } from '@/_interface/ItemDef';
import { useWarehouseItemsQuery } from '@/components/hooks/useWarehouseItemsQuery';

const ITEM_PAGE_SIZE = 10;

export function VoucherItemSelector({
	tenantId,
	selectedItemIds,
	disabled,
	onChange,
}: {
	tenantId: number;
	selectedItemIds: number[];
	disabled: boolean;
	onChange: (itemIds: number[]) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [nameQuery, setNameQuery] = useState('');
	const [appliedQuery, setAppliedQuery] = useState('');
	const [page, setPage] = useState(1);
	const itemsQuery = useWarehouseItemsQuery(tenantId, page, appliedQuery, isOpen);
	const items = itemsQuery.data?.result?.itemDefs ?? [];
	const total = itemsQuery.data?.result?.count ?? 0;
	const selectedItemCounts = selectedItemIds.reduce((counts, itemId) => {
		counts.set(itemId, (counts.get(itemId) ?? 0) + 1);
		return counts;
	}, new Map<number, number>());
	const selectedItemSummary = Array.from(selectedItemCounts, ([itemId, count]) =>
		count > 1 ? `${itemId} (${count}x)` : `${itemId}`,
	).join(', ');

	function applySearch(value: string) {
		setPage(1);
		setAppliedQuery(value.trim());
	}

	function setItemCount(itemId: number, count: number) {
		const currentCount = selectedItemIds.filter(id => id === itemId).length;
		if (count > currentCount) {
			onChange([...selectedItemIds, ...Array.from({ length: count - currentCount }, () => itemId)]);
			return;
		}
		let removeCount = currentCount - count;
		onChange(
			selectedItemIds.filter(id => {
				if (id !== itemId || removeCount === 0) return true;
				removeCount -= 1;
				return false;
			}),
		);
	}

	function handleItemCountChange(itemId: number, value: number | null) {
		if (value === null || !Number.isInteger(value) || value < 0) return;
		setItemCount(itemId, value);
	}

	return (
		<div className="col-12 mb-3">
			<label className="form-label">Item Combinations *</label>
			<div className="d-flex align-items-center gap-2 flex-wrap">
				<button
					type="button"
					className="btn btn-outline-primary btn-sm"
					disabled={disabled}
					onClick={() => setIsOpen(open => !open)}
				>
					{isOpen ? 'Hide items' : 'Select items'}
				</button>
				<span className={`${selectedItemIds.length > 0 ? 'text-muted' : 'text-danger'} small`}>
					{selectedItemIds.length > 0
						? `Item IDs: ${selectedItemSummary}`
						: 'No items selected. Select at least one item.'}
				</span>
			</div>
			{isOpen && (
				<div className="border rounded p-3 mt-2">
					<Input.Search
						placeholder="Search warehouse items..."
						allowClear
						value={nameQuery}
						disabled={itemsQuery.isFetching || disabled}
						onChange={event => setNameQuery(event.target.value)}
						onSearch={applySearch}
					/>
					{itemsQuery.data?.error && (
						<Alert className="mt-2" type="error" showIcon message={itemsQuery.data.error} />
					)}
					{itemsQuery.isError && (
						<Alert
							className="mt-2"
							type="error"
							showIcon
							message={itemsQuery.error instanceof Error ? itemsQuery.error.message : 'Unable to load warehouse items.'}
						/>
					)}
					{itemsQuery.isLoading ? (
						<p className="text-center text-muted my-3">Loading warehouse items...</p>
					) : (
						<>
							<div className="table-responsive mt-2">
								<table className="table table-hover mb-0">
									<thead>
										<tr>
											<th aria-label="Select item" />
											<th>ID</th>
											<th>Item name</th>
											<th>Selected quantity</th>
										</tr>
									</thead>
									<tbody>
										{items.map((item: ItemDef) => {
											const outOfStock = item.stocks === 0 && item.stock_type === StockType.TRACKED;
											const selectedCount = selectedItemIds.filter(id => id === item.item_id).length;
											return (
												<tr
													key={item.item_id}
													role={outOfStock ? undefined : 'button'}
													style={{
														cursor: outOfStock ? 'not-allowed' : 'pointer',
														opacity: outOfStock ? 0.45 : 1,
														backgroundColor: selectedCount > 0 ? 'var(--bs-primary-bg-subtle, #cfe2ff)' : undefined,
													}}
													onClick={
														outOfStock || disabled
															? undefined
															: () => setItemCount(item.item_id, selectedCount > 0 ? 0 : 1)
													}
												>
													<td className="text-center" onClick={event => event.stopPropagation()}>
														<input
															type="checkbox"
															checked={selectedCount > 0}
															disabled={outOfStock || disabled}
															aria-label={`Select ${item.item_name}`}
															onChange={() => setItemCount(item.item_id, selectedCount > 0 ? 0 : 1)}
														/>
													</td>
													<td>{item.item_id}</td>
													<td>{item.item_name}</td>
													<td onClick={event => event.stopPropagation()}>
														<InputNumber
															min={0}
															step={1}
															precision={0}
															value={selectedCount}
															disabled={disabled || outOfStock}
															aria-label={`Selected quantity for ${item.item_name}`}
															onChange={value => handleItemCountChange(item.item_id, value)}
														/>
													</td>
												</tr>
											);
										})}
										{items.length === 0 && (
											<tr>
												<td colSpan={4} className="text-center text-muted">
													No warehouse items found.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
							{total > ITEM_PAGE_SIZE && (
								<Pagination
									className="mt-3"
									align="center"
									current={page}
									pageSize={ITEM_PAGE_SIZE}
									total={total}
									showSizeChanger={false}
									disabled={itemsQuery.isFetching || disabled}
									onChange={setPage}
								/>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
