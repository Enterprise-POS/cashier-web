'use client';

import { all_routes as routes } from '@/components/core/data/all_routes';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';
import { PlusCircle } from 'react-feather';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Employees() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Employees</h4>
								<h6>Manage your employees</h6>
							</div>
						</div>
						<ul className="table-top-head">
							{/* <li>
								<div className="d-flex me-2 pe-2 border-end">
									<Link href={routes.employeesList} className="btn-list me-2">
										<i data-feather="list" className="feather-list" />
									</Link>
									<Link href={routes.employees} className="btn-grid active bg-primary me-2">
										<i data-feather="grid" className="feather-grid text-white" />
									</Link>
								</div>
							</li> */}
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href={routes.employees} className="btn btn-primary">
								<PlusCircle data-feather="plus-circle" className=" me-2" />
								Add Employee
							</Link>
						</div>
					</div>
					<div className="row">
						<div className="col-xl-3 col-md-6">
							<div className="card bg-purple border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Total Employee</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-purple-900">
											<i className="ti ti-users-group" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-teal border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Active</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-teal-900">
											<i className="ti ti-user-star" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-secondary border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">Inactive</p>
										<h4 className="text-white">1007</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-secondary-900">
											<i className="ti ti-user-exclamation" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-md-6">
							<div className="card bg-info border-0">
								<div className="card-body d-flex align-items-center justify-content-between">
									<div>
										<p className="mb-1 text-white">New Joiners</p>
										<h4 className="text-white">67</h4>
									</div>
									<div>
										<span className="avatar avatar-lg bg-info-900">
											<i className="ti ti-user-check" />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* /product list */}
					<div className="card">
						<div className="card-body">
							<div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
								<div className="search-set mb-0">
									<div className="search-input">
										<Link href="#" className="btn btn-searchset">
											<i data-feather="search" className="feather-search" />
										</Link>
										<input type="search" className="form-control" placeholder="Search" />
									</div>
								</div>
								<div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
									<div className="dropdown me-2">
										<Link
											href="#"
											className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
											data-bs-toggle="dropdown"
										>
											Select Employees
										</Link>
										<ul className="dropdown-menu  dropdown-menu-end p-3">
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Anthony Lewis
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Brian Villalobos
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Harvey Smith
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Stephan Peralt
												</Link>
											</li>
										</ul>
									</div>
									<div className="dropdown me-2">
										<Link
											href="#"
											className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
											data-bs-toggle="dropdown"
										>
											Designation
										</Link>
										<ul className="dropdown-menu  dropdown-menu-end p-3">
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													System Admin
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Designer
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Tech Lead
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Database administrator
												</Link>
											</li>
										</ul>
									</div>
									<div className="dropdown me-2">
										<Link
											href="#"
											className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
											data-bs-toggle="dropdown"
										>
											Select Status
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
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													New Joiners
												</Link>
											</li>
										</ul>
									</div>
									<div className="dropdown">
										<Link
											href="#"
											className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
											data-bs-toggle="dropdown"
										>
											Sort By : Last 7 Days
										</Link>
										<ul className="dropdown-menu  dropdown-menu-end p-3">
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Recently Added
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Ascending
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Desending
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Last Month
												</Link>
											</li>
											<li>
												<Link href="#" className="dropdown-item rounded-1">
													Last 7 Days
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* /product list */}
					<div className="employee-grid-widget">
						<div className="row">
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
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
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS001</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Anthony Lewis</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>HR</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-02.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS002</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Brian Villalobos</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">Software Developer</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>UI/IX</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-03.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS003</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Harvey Smith</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Admin</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-06.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS004</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Stephan Peralt</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Admin</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-08.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS005</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Doglas Martini</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>IT</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-19.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS006</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Linda Ray</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Support</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-28.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS007</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Elliot Murray</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>UI/UX</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-17.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS008</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Rebecca Smtih</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>HR</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-30.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS009</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Connie Waters</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Admin</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-26.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS010</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Lori Broaddus</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>React JS</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-11.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS011</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Trent Frazier</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Support</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
								<div className="card">
									<div className="card-body">
										<div className="d-flex align-items-start justify-content-between mb-2">
											<div className="form-check form-check-md">
												<input className="form-check-input" type="checkbox" />
											</div>
											<div>
												<Link
													href={routes.employeedetails}
													className="avatar avatar-xl avatar-rounded border p-1 rounded-circle"
												>
													<Image
														width={60}
														height={60}
														src="/assets/img/users/user-04.jpg"
														className="img-fluid h-auto w-auto"
														alt="img"
													/>
												</Link>
											</div>
											<div className="dropdown">
												<Link href="#" className="action-icon border-0" data-bs-toggle="dropdown" aria-expanded="false">
													<i data-feather="more-vertical" className="feather-more-vertical" />
												</Link>
												<ul className="dropdown-menu dropdown-menu-end ">
													<li>
														<Link href={routes.editemployee} className="dropdown-item">
															<i data-feather="edit" className="me-2" />
															Edit
														</Link>
													</li>
													<li>
														<Link href="#" className="dropdown-item confirm-text mb-0">
															<i data-feather="trash-2" className="me-2" />
															Delete
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className="text-center">
											<p className="text-primary mb-2">EMP ID : POS012</p>
										</div>
										<div className="text-center mb-3">
											<h6 className="mb-1">
												<Link href={routes.employeedetails}>Norene Valle</Link>
											</h6>
											<span className="badge bg-secondary-transparent fs-10 fw-medium">System Admin</span>
										</div>
										<div className="d-flex align-items-center justify-content-between bg-light rounded p-3">
											<div className="text-start">
												<h6 className="mb-1">Joined</h6>
												<p>30 May 2023</p>
											</div>
											<div className="text-start">
												<h6 className="mb-1">Department</h6>
												<p>Admin</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
