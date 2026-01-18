import Image from 'next/image';
import Link from 'next/link';
import { Delete, Edit, MoreVertical } from 'react-feather';

import { all_routes as routes } from '@/components/core/data/all_routes';
import { Store as _Store } from '@/_classes/Store';

export default function Store({ store, onDeleteButton }: { store: _Store; onDeleteButton: (store: _Store) => void }) {
	return (
		<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
			<div className="card">
				<div className="card-body">
					<div className="d-flex align-items-start justify-content-between mb-2">
						<div className="form-check form-check-md">
							<input className="form-check-input" type="checkbox" />
						</div>
						<div>
							<Link href={routes.employeedetails} className="avatar avatar-xl avatar-rounded border p-1 rounded-circle">
								<Image
									width={60}
									height={60}
									src="/assets/img/users/user-32.jpg"
									className="img-fluid h-auto w-auto"
									alt="img"
								/>
							</Link>
						</div>
						<div className="dropdown">
							<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
								<MoreVertical style={{ scale: 0.9 }} className="text-gray" />
							</Link>
							<ul className="dropdown-menu dropdown-menu-end ">
								{/* <li>
									<Link href={routes.editemployee} className="dropdown-item">
										<Edit className="me-2" style={{ width: '16px' }} />
										Edit
									</Link>
								</li> */}
								<li>
									<Link
										href="#"
										className="dropdown-item confirm-text mb-0"
										data-bs-toggle="modal"
										data-bs-target="#delete-modal"
										onClick={() => onDeleteButton(store)}
									>
										<Delete className="me-2" style={{ width: '16px' }} />
										{store.isActive ? 'Delete' : 'Undo'}
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="text-center">
						<p className="text-primary mb-2">ID : {store.id}</p>
					</div>
					<div className="text-center mb-3">
						<h6 className="mb-1">
							<Link href="#">{store.name}</Link>
						</h6>
						<span className={`badge ${store.isActive ? 'bg-success' : 'bg-danger'} fs-10 fw-medium`}>
							{store.isActive ? 'Active' : 'InActive'}
						</span>
					</div>
					<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
						<div className="text-start">
							<h6 className="mb-1">Created at</h6>
							<p>{store.createdAt.toLocaleString()}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
