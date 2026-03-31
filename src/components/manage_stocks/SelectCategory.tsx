import Link from 'next/link';

import { getCategories } from '@/_lib/category';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/_classes/Category';
import { CategoryDef } from '@/_interface/CategoryDef';
import { useMemo } from 'react';

export function SelectCategory({
	tenantId,
	onSelected,
	isModalOpen,
}: {
	tenantId: number;
	isModalOpen: boolean;
	onSelected: (categoryId: number, categoryName: string) => void;
}) {
	const categoriesQuery = useQuery({
		queryKey: ['categories', tenantId],
		queryFn: () => getCategories(tenantId, 1, 10, ''),
		enabled: tenantId !== 0 && isModalOpen,
		staleTime: 1000 * 60 * 5, // cache for 5 min
	});

	// console.log(categoriesQuery);
	const categories = useMemo(() => {
		return categoriesQuery.isSuccess
			? categoriesQuery.data.result!.categoryDefs.map((def: CategoryDef) => new Category(def))
			: [];
	}, [categoriesQuery.data, categoriesQuery.isSuccess]);

	return (
		<>
			{/* Select category */}
			<div className="modal fade" id="select-category">
				<div className="modal-dialog modal-dialog-centered stock-adjust-modal">
					<div className="modal-content">
						<div className="modal-header">
							<div className="page-title">
								<h4>Select category to filter</h4>
							</div>
							<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<form>
							<div className="modal-body">
								<div className="row mb-2">
									<div className="col">
										{categoriesQuery.isLoading ? (
											<p className="text-center" key={0}>
												loading categories...
											</p>
										) : (
											<div className="card">
												<div className="table-responsive">
													<table className="table table-hover mb-0">
														<thead>
															<tr>
																<th>ID</th>
																<th>Category name</th>
															</tr>
														</thead>
														<tbody>
															{categories.map(category => (
																<tr
																	key={category.id}
																	role="button"
																	data-bs-dismiss="modal"
																	onClick={() => onSelected(category.id, category.categoryName)}
																>
																	<td>{category.id}</td>
																	<td>{category.categoryName}</td>
																</tr>
															))}
															<tr
																key={0}
																role="button"
																data-bs-dismiss="modal"
																onClick={() => onSelected(0, 'unselect')}
															>
																<td></td>
																<td>unselect</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
									Cancel
								</button>
								<Link href="#" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {}}>
									Confirm
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* /Edit Stock */}
		</>
	);
}
