'use client';
import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useEffect, useOptimistic, useState } from 'react';
import { Trash2 } from 'react-feather';
import Select from 'react-select';

import { Tenant } from '@/_classes/Tenant';
import { User } from '@/_classes/User';
import { HTTPResult } from '@/_interface/HTTPResult';
import { UserDef } from '@/_interface/UserDef';
import { getTenantMembers, removeMemberFromTenant } from '@/_lib/action';
import Table, { DataTableColumn } from '@/components/pagination/datatable';
import SectionLoading from '@/components/partials/SectionLoading';
import { useTenant } from '@/components/provider/TenantProvider';

export default function MemberList({ sub }: { sub: number }) {
	const { data, isStateLoading } = useTenant();
	const [isMounted, setIsMounted] = useState(false);
	const [isComponentLoading, setComponentLoading] = useState(false);
	const [currentDeleteModalData, setCurrentDeleteModalData] = useState<{ userId: number; name: string } | null>(null);

	// Will optimistically delete user even the request is loading
	const [tenantMembers, setTenantMembers] = useState<User[]>([]);
	const [optimisticMembers, optimisticDelete] = useOptimistic(tenantMembers, (currMembers: User[], userId) => {
		return currMembers.filter(user => user.id !== userId);
	});

	const [isFormLoading, setFormLoading] = useState(false);

	// Success Toast
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Error Toast
	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);
	const dataSource = optimisticMembers;
	const options1 = [
		{ value: 'choose', label: 'Choose' },
		{ value: 'steven', label: 'Steven' },
		{ value: 'gravely', label: 'Gravely' },
	];

	const options2 = [
		{ value: 'choose', label: 'Choose' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'us', label: 'United States' },
	];
	const columns: DataTableColumn[] = [
		{
			title: 'Members',
			dataIndex: 'name',
			render: (text: string, _: User) => (
				<div className="d-flex align-items-center">
					<Link href="#" className="avatar avatar-md">
						<Image
							src={`/assets/img/warehouse/avatar-01.png`}
							className="img-fluid rounded-2"
							alt="img"
							width={32}
							height={32}
						/>
					</Link>
					<div className="ms-2">
						<p className="mb-0">
							<Link href="#" className="text-default">
								{text}
							</Link>
						</p>
					</div>
				</div>
			),
			sorter: (a: User, b: User) => a.name.length - b.name.length,
		},

		{
			title: 'Email',
			dataIndex: 'email',
			sorter: (a: User, b: User) => a.email.length - b.email.length,
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			sorter: (a: User, b: User) => a.createdAt.getTime() - b.createdAt.getTime(),
			render: (text: Date, _: User) => text.toDateString(),
		},
		{
			title: 'Status',
			dataIndex: 'id',
			sorter: (a: User, b: User) => a.id - b.id,
			render: (id: number, _: User) => (
				<span
					className={`badge  d-inline-flex align-items-center badge-xs ${
						id === selectedTenant?.ownerUserId ? 'badge-warning' : 'badge-success'
					}`}
				>
					<i className="ti ti-point-filled me-1"></i>
					{id === selectedTenant?.ownerUserId ? 'owner' : 'member'}
				</span>
			),
		},

		{
			title: 'Actions',
			dataIndex: 'id',
			key: 'actions',
			render: (id: number, user: User) => (
				<div className="action-table-data">
					<div className="edit-delete-action">
						{/* <Link className="me-2 edit-icon p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
                <i data-feather="eye" className="feather-eye"></i>
            </Link> */}
						{/* <Link className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
                <i data-feather="edit" className="feather-edit"></i>
            </Link> */}
						<Link
							className="confirm-text p-2"
							href="#"
							data-bs-toggle="modal"
							data-bs-target="#delete-modal"
							onClick={() => setCurrentDeleteModalData({ userId: id, name: user.name })}
						>
							<Trash2 />
						</Link>
					</div>
				</div>
			),
		},
	];

	async function handleDelete(name: string, userId: number, tenantId: number) {
		startTransition(() => optimisticDelete(userId));
		setFormLoading(true);
		const { error } = await removeMemberFromTenant(userId, tenantId);

		// When error occurred, the optimistic will rollback the data
		if (error !== null) {
			console.warn(error);
			setErrorMessage(error);
			setShowErrorToast(true);
			setTimeout(() => setShowErrorToast(false), 5000);
		} else {
			// This will make react not to render again the deleted user
			const toBeRemoveMemberId = userId;
			setTenantMembers(member => member.filter(m => m.id !== toBeRemoveMemberId));

			// 3 seconds showing toast
			// after 3 second hide from screen
			setShowSuccessToast(true);
			setSuccessMessage(`${name} removed`);
			setTimeout(() => setShowSuccessToast(false), 5000);
		}
		setFormLoading(false);
	}

	useEffect(() => {
		async function getData() {
			try {
				setComponentLoading(true);
				if (selectedTenant !== undefined) {
					const { result, error }: HTTPResult<UserDef[]> = await getTenantMembers(selectedTenant.id);
					if (error !== null) {
						// TODO: REMOVE THIS
						console.warn(error);
					} else {
						const currentTenantMembers = result!.map((memberDef: UserDef) => new User(memberDef));
						setTenantMembers(currentTenantMembers);
					}
				} else {
					//
				}
			} catch (e) {
				const error = e as Error;
				console.error(`[ERROR] ${error.message}`);
			} finally {
				setComponentLoading(false);
			}
		}

		getData();
	}, [selectedTenant]);

	/*
		useEffect setMounted will Prevent hydration
	*/
	useEffect(() => setIsMounted(true), []);
	if (!isMounted || isStateLoading || isComponentLoading)
		return <SectionLoading caption={`Loading ${selectedTenant?.name ?? ''} members`} />;

	return (
		<>
			<div className="card table-list-card">
				<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
					<div className="search-set"></div>
					<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
						<div className="dropdown me-2">
							<Link
								href="#"
								className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
								data-bs-toggle="dropdown"
							>
								Status
							</Link>
							<ul className="dropdown-menu  dropdown-menu-end p-3">
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Active
									</Link>
								</li>
								<li>
									<Link href="#" className="dropdown-item rounded-1">
										Inactive
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						{/* 
							isComponentLoading is crucial when render the data.
							if the data don't arrive yet. Then Table won't render
							the data, instead empty data.

							Error case:
								by first the data won't show. but when we type at search bar
								the data will show
						*/}
						<Table props={dataSource.length.toString()} columns={columns} dataSource={dataSource} />
					</div>
				</div>
			</div>

			{/* Modals */}
			<div>
				{/* Add Member */}
				<div className="modal fade" id="add-units">
					<div className="modal-dialog modal-dialog-centered custom-modal-two">
						<div className="modal-content">
							<div className="page-wrapper-new p-0">
								<div className="content p-0">
									<div className="modal-header border-0 custom-modal-header">
										<div className="page-title">
											<h4>Add Member</h4>
										</div>
										<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<div className="modal-body custom-modal-body">
										<form>
											<div className="modal-title-head">
												<h6>
													<span>
														<i data-feather="info" className="feather-info me-2" />
													</span>
													Invite Member
												</h6>
											</div>
											<div className="row">
												<div className="col-lg-12">
													<div className="mb-3">
														<label className="form-label">Email</label>
														<input type="email" className="form-control" />
													</div>
												</div>
											</div>
											<div className="modal-footer-btn">
												<button type="button" className="btn btn-cancel me-2" data-bs-dismiss="modal">
													Cancel
												</button>
												<button type="submit" className="btn btn-submit">
													Send Invitation
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Edit */}
				<div className="modal fade" id="edit-units">
					<div className="modal-dialog modal-dialog-centered custom-modal-two">
						<div className="modal-content">
							<div className="page-wrapper-new p-0">
								<div className="content p-0">
									<div className="modal-header border-0 custom-modal-header">
										<div className="page-title">
											<h4>Edit Warehouse</h4>
										</div>
										<button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<div className="modal-body custom-modal-body">
										<form>
											<div className="modal-title-head">
												<h6>
													<span>
														<i data-feather="info" className="feather-info me-2" />
													</span>
													Warehouse Info
												</h6>
											</div>
											<div className="row">
												<div className="col-lg-6">
													<div className="mb-3">
														<label className="form-label">Name</label>
														<input type="text" className="form-control" defaultValue="Legendary" />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="input-blocks">
														<label>Contact Person</label>
														<Select classNamePrefix="react-select" options={options1} />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="mb-3 war-edit-phone">
														<label className="mb-2">Phone Number</label>
														<input className="form-control" id="phone2" name="phone" type="text" />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="mb-3 war-edit-phone">
														<label className="form-label">Work Phone</label>
														<input className="form-control" id="phone3" name="phone" type="text" />
													</div>
												</div>
												<div className="col-lg-12">
													<div className="mb-3">
														<label className="form-label">Email</label>
														<input type="email" className="form-control" defaultValue="stevenlegendary@example.com" />
													</div>
												</div>
												<div className="modal-title-head">
													<h6>
														<span>
															<i data-feather="map-pin" />
														</span>
														Location
													</h6>
												</div>
												<div className="col-lg-12">
													<div className="mb-3">
														<label className="form-label">Address 1</label>
														<input type="text" className="form-control" defaultValue="Admiral Street" />
													</div>
												</div>
												<div className="col-lg-12">
													<div className="input-blocks">
														<label className="form-label">Address 2</label>
														<input type="text" className="form-control" defaultValue="Aire Street" />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="input-blocks">
														<label>Country</label>
														<Select classNamePrefix="react-select" options={options2} />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="mb-3">
														<label className="form-label">State</label>
														<input type="text" className="form-control" defaultValue="East England" />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="mb-3 mb-0">
														<label className="form-label">City</label>
														<input type="text" className="form-control" defaultValue="Leeds" />
													</div>
												</div>
												<div className="col-lg-6">
													<div className="mb-3 mb-0">
														<label className="form-label">Zipcode</label>
														<input type="text" className="form-control" defaultValue="LS1" />
													</div>
												</div>
											</div>
											<div className="modal-footer-btn">
												<button type="button" className="btn btn-cancel me-2" data-bs-dismiss="modal">
													Cancel
												</button>
												<button type="submit" className="btn btn-submit">
													Save Changes
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Delete */}
			<div className="modal fade" id="delete-modal">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="page-wrapper-new p-0">
							<div className="p-5 px-3 text-center">
								<span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
									<i className="ti ti-trash fs-24 text-danger" />
								</span>
								<h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">
									Remove &apos;{currentDeleteModalData?.name}&apos;
								</h4>
								<p className="text-gray-6 mb-0 fs-16">
									Are you sure you want to remove {currentDeleteModalData?.name}?
								</p>
								<div className="modal-footer-btn mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
										data-bs-dismiss="modal"
									>
										Cancel
									</button>
									<button
										type="button"
										data-bs-dismiss="modal"
										className="btn btn-primary fs-13 fw-medium p-2 px-3"
										onClick={() =>
											handleDelete(
												currentDeleteModalData?.name ?? '',
												currentDeleteModalData?.userId ?? 0,
												data.selectedTenantId
											)
										}
									>
										Yes Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Success Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${showSuccessToast ? 'show' : ''} colored-toast bg-success-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-success text-fixed-white">
						<strong className="me-auto">Congratulation !</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{successMessage}</div>
				</div>
			</div>

			{/* Error Toast */}
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div
					id="liveToast"
					className={`toast ${showErrorToast ? 'show' : ''} colored-toast bg-danger-transparent`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-header bg-danger text-fixed-white">
						<strong className="me-auto">Warning</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{errorMessage}</div>
				</div>
			</div>
		</>
	);
}
