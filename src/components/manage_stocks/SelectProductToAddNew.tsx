import { useQuery } from '@tanstack/react-query';
import { Input, Pagination } from 'antd';
import { useMemo, useState } from 'react';

import { Item } from '@/_classes/Item';
import { ItemDef } from '@/_interface/ItemDef';
import { getActiveWarehouseItem } from '@/_lib/warehouse';

export function SelectProductToAddNew({
	tenantId,
	onSelected,
	isModalOpen,
}: {
	tenantId: number;
	isModalOpen: boolean;
	onSelected: (itemId: number, itemName: string) => void;
}) {
	const [nameQuery, setNameQuery] = useState('');
	const [appliedQuery, setAppliedQuery] = useState('');
	const [page, setPage] = useState(1);
	const limit = 10;

	const warehouseItemQuery = useQuery({
		queryKey: ['warehouse', tenantId, page, appliedQuery],
		queryFn: () => getActiveWarehouseItem(tenantId, limit, page, appliedQuery),
		enabled: tenantId !== 0 && isModalOpen,
		staleTime: 1000 * 60 * 5,
	});

	const { items, count } = useMemo(() => {
		if (!warehouseItemQuery.isSuccess) return { items: [], count: 0 };
		const result = warehouseItemQuery.data.result!;
		return {
			items: result.itemDefs.map((def: ItemDef) => new Item(def)),
			count: result.count,
		};
	}, [warehouseItemQuery.data, warehouseItemQuery.isSuccess]);

	const paddedItems = useMemo(() => {
		const placeholders = Array.from({ length: Math.max(0, limit - items.length) }, (_, i) => ({
			id: `placeholder-${i}`,
		}));
		return { real: items, placeholders };
	}, [items]);

	const applyFilters = () => {
		setPage(1);
		setAppliedQuery(nameQuery);
	};

	return (
		<div className="modal fade" id="select-product-to-add-new">
			<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="page-title">
							<h4>Select products to add new</h4>
						</div>
						<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>

					{/* onSubmit prevents Enter from refreshing the page */}
					<form onSubmit={e => e.preventDefault()}>
						<div className="px-4 pt-3 pb-0">
							<Input.Search
								placeholder="Search items..."
								allowClear
								value={nameQuery}
								onChange={e => setNameQuery(e.target.value)}
								onSearch={applyFilters}
							/>
						</div>

						<div className="modal-body">
							<div className="row mb-2">
								<div className="col">
									{warehouseItemQuery.isLoading ? (
										<p className="text-center">Loading products...</p>
									) : (
										<div className="card mb-1">
											<div className="table-responsive">
												<table className="table table-hover mb-0">
													<thead>
														<tr>
															<th>ID</th>
															<th>Product Name</th>
														</tr>
													</thead>
													<tbody>
														{paddedItems.real.map(item => (
															<tr
																key={item.id}
																role="button"
																style={{ cursor: 'pointer' }}
																data-bs-dismiss="modal"
																onClick={() => onSelected(item.id, item.itemName)}
															>
																<td>{item.id}</td>
																<td>{item.itemName}</td>
															</tr>
														))}
														{paddedItems.placeholders.map(p => (
															<tr key={p.id} style={{ pointerEvents: 'none' }}>
																<td>&nbsp;</td>
																<td>&nbsp;</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									)}
								</div>
							</div>

							{!warehouseItemQuery.isLoading && items.length > 0 && (
								<p className="text-center text-muted small mb-2">Click a row to select the product</p>
							)}

							{!warehouseItemQuery.isLoading && (
								<Pagination
									align="center"
									current={page}
									pageSize={limit}
									total={count}
									showSizeChanger={false}
									onChange={setPage}
								/>
							)}
						</div>

						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
