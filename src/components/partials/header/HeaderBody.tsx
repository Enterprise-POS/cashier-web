'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { all_routes as routes } from '@/components/core/data/all_routes';

const excludedPathnames = [routes.login, routes.register];

export default function HeaderTop({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	if (excludedPathnames.includes(pathname)) {
		return null;
	}

	return (
		<div className="header">
			<div className="main-header">
				{/* <!-- Logo --> */}
				<div className="header-left active">
					<a href="index.html" className="logo logo-normal">
						<Image src="/assets/img/logo.svg" alt="Img" width={30} height={30} />
					</a>
					<a href="index.html" className="logo logo-white">
						<Image src="/assets/img/logo-white.svg" alt="Img" width={30} height={30} />
					</a>
					<a href="index.html" className="logo-small">
						<Image src="/assets/img/logo-small.png" alt="Img" width={30} height={30} />
					</a>
				</div>
				{/* <!-- /Logo --> */}

				<a id="mobile_btn" className="mobile_btn" href="#sidebar">
					<span className="bar-icon">
						<span></span>
						<span></span>
						<span></span>
					</span>
				</a>

				{/* <!-- Header Menu --> */}
				<ul className="nav user-menu">
					{/* <!-- Search --> */}
					<li className="nav-item nav-searchinputs">
						<div className="top-nav-search">
							<a href="#" className="responsive-search">
								<i className="fa fa-search"></i>
							</a>
							<form action="#" className="dropdown">
								<div
									className="searchinputs input-group dropdown-toggle"
									id="dropdownMenuClickable"
									data-bs-toggle="dropdown"
									data-bs-auto-close="outside"
								>
									<input type="text" placeholder="Search" />
									<div className="search-addon">
										<span>
											<i className="ti ti-search"></i>
										</span>
									</div>
									<span className="input-group-text">
										<kbd className="d-flex align-items-center">
											<Image src="/assets/img/icons/command.svg" alt="img" className="me-1" width={10} height={10} />K
										</kbd>
									</span>
								</div>
								<div className="dropdown-menu search-dropdown" aria-labelledby="dropdownMenuClickable">
									<div className="search-info">
										<h6>
											<span>
												<i data-feather="search" className="feather-16"></i>
											</span>
											Recent Searches
										</h6>
										<ul className="search-tags">
											<li>
												<a href="#">Products</a>
											</li>
											<li>
												<a href="#">Sales</a>
											</li>
											<li>
												<a href="#">Applications</a>
											</li>
										</ul>
									</div>
									<div className="search-info">
										<h6>
											<span>
												<i data-feather="help-circle" className="feather-16"></i>
											</span>
											Help
										</h6>
										<p>How to Change Product Volume from 0 to 200 on Inventory management</p>
										<p>Change Product Name</p>
									</div>
									<div className="search-info">
										<h6>
											<span>
												<i data-feather="user" className="feather-16"></i>
											</span>
											Customers
										</h6>
										<ul className="customers">
											<li>
												<a href="#">
													Aron Varu
													<Image
														src="/assets/img/profiles/avator1.jpg"
														alt="Img"
														className="img-fluid"
														width={30}
														height={30}
													/>
												</a>
											</li>
											<li>
												<a href="#">
													Jonita
													<Image
														src="/assets/img/profiles/avatar-01.jpg"
														alt="Img"
														className="img-fluid"
														width={30}
														height={30}
													/>
												</a>
											</li>
											<li>
												<a href="#">
													Aaron
													<Image
														src="/assets/img/profiles/avatar-10.jpg"
														alt="Img"
														className="img-fluid"
														width={30}
														height={30}
													/>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</form>
						</div>
					</li>
					{/* <!-- /Search --> */}

					{/* <!-- Select Store --> */}
					<li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
						<a href="#" className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown">
							<span className="user-info">
								<span className="user-letter">
									<Image
										src="/assets/img/store/store-01.png"
										alt="Store Logo"
										className="img-fluid"
										width={30}
										height={30}
									/>
								</span>
								<span className="user-detail">
									<span className="user-name">Freshmart</span>
								</span>
							</span>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<a href="#" className="dropdown-item">
								<Image
									src="/assets/img/store/store-01.png"
									alt="Store Logo"
									className="img-fluid"
									width={30}
									height={30}
								/>
								Freshmart
							</a>
							<a href="#" className="dropdown-item">
								<Image
									src="/assets/img/store/store-02.png"
									alt="Store Logo"
									className="img-fluid"
									width={30}
									height={30}
								/>
								Grocery Apex
							</a>
							<a href="#" className="dropdown-item">
								<Image
									src="/assets/img/store/store-03.png"
									alt="Store Logo"
									className="img-fluid"
									width={30}
									height={30}
								/>
								Grocery Bevy
							</a>
							<a href="#" className="dropdown-item">
								<Image
									src="/assets/img/store/store-04.png"
									alt="Store Logo"
									className="img-fluid"
									width={30}
									height={30}
								/>
								Grocery Eden
							</a>
						</div>
					</li>
					{/* <!-- /Select Store --> */}

					<li className="nav-item dropdown link-nav">
						<a href="#" className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
							<i className="ti ti-circle-plus me-1"></i>Add New
						</a>
						<div className="dropdown-menu dropdown-xl dropdown-menu-center">
							<div className="row g-2">
								<div className="col-md-2">
									<a href={routes.categoryList} className="link-item">
										<span className="link-icon">
											<i className="ti ti-brand-codepen"></i>
										</span>
										<p>Category</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href={routes.addProduct} className="link-item">
										<span className="link-icon">
											<i className="ti ti-square-plus"></i>
										</span>
										<p>Product</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href={routes.categoryList} className="link-item">
										<span className="link-icon">
											<i className="ti ti-shopping-bag"></i>
										</span>
										<p>Purchase</p>
									</a>
								</div>
								{/* <div className="col-md-2">
									<a href="online-orders.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-shopping-cart"></i>
										</span>
										<p>Sale</p>
									</a>
								</div> */}
								{/* <div className="col-md-2">
									<a href="expense-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-file-text"></i>
										</span>
										<p>Expense</p>
									</a>
								</div> */}
								{/* <div className="col-md-2">
									<a href="quotation-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-device-floppy"></i>
										</span>
										<p>Quotation</p>
									</a>
								</div> */}
								{/* <div className="col-md-2">
									<a href="sales-returns.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-copy"></i>
										</span>
										<p>Return</p>
									</a>
								</div> */}
								<div className="col-md-2">
									<a href={routes.users} className="link-item">
										<span className="link-icon">
											<i className="ti ti-user"></i>
										</span>
										<p>Users</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href={routes.customers} className="link-item">
										<span className="link-icon">
											<i className="ti ti-users"></i>
										</span>
										<p>Customers</p>
									</a>
								</div>
								{/* <div className="col-md-2">
									<a href="sales-report.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-shield"></i>
										</span>
										<p>Biller</p>
									</a>
								</div> */}
								{/* <div className="col-md-2">
									<a href="suppliers.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-user-check"></i>
										</span>
										<p>Supplier</p>
									</a>
								</div> */}
								<div className="col-md-2">
									<a href={routes.stockTransfer} className="link-item">
										<span className="link-icon">
											<i className="ti ti-truck"></i>
										</span>
										<p>Transfer</p>
									</a>
								</div>
							</div>
						</div>
					</li>

					<li className="nav-item pos-nav">
						<a href="pos.html" className="btn btn-dark btn-md d-inline-flex align-items-center">
							<i className="ti ti-device-laptop me-1"></i>POS
						</a>
					</li>

					{/* <!-- Flag --> */}
					<li className="nav-item dropdown has-arrow flag-nav nav-item-box">
						<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
							<i className="ti ti-language"></i>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<a href="#" className="dropdown-item">
								<Image src="/assets/img/flags/english.svg" alt="Img" height={16} width={16} />
								English
							</a>
							<a href="#" className="dropdown-item">
								<Image src="/assets/img/flags/jp.png" alt="Img" height={16} width={16} />
								日本語
							</a>
							<a href="#" className="dropdown-item">
								<Image src="/assets/img/flags/id.png" alt="Img" height={16} width={16} />
								Indonesia
							</a>
						</div>
					</li>
					{/* <!-- /Flag --> */}

					<li className="nav-item nav-item-box">
						<a href="#" id="btnFullscreen">
							<i className="ti ti-maximize"></i>
						</a>
					</li>
					{/* <li className="nav-item nav-item-box">
						<a href="email.html">
							<i className="ti ti-mail"></i>
							<span className="badge rounded-pill">1</span>
						</a>
					</li> */}

					{/* <!-- Notifications --> */}
					{/* <li className="nav-item dropdown nav-item-box">
						<a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
							<i className="ti ti-bell"></i>
						</a>
						<div className="dropdown-menu notifications">
							<div className="topnav-dropdown-header">
								<h5 className="notification-title">Notifications</h5>
								<a href="javascript:void(0)" className="clear-noti">
									Mark all as read
								</a>
							</div>
							<div className="noti-content">
								<ul className="notification-list">
									<li className="notification-message">
										<a href="activities.html">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<Image alt="Img" src="/assets/img/profiles/avatar-13.jpg" width={30} height={30} />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details">
														<span className="noti-title">James Kirwin</span> confirmed his order. Order No:
														#78901.Estimated delivery: 2 days
													</p>
													<p className="noti-time">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<Image alt="Img" src="/assets/img/profiles/avatar-03.jpg" width={30} height={30} />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details">
														<span className="noti-title">Leo Kelly</span> cancelled his order scheduled for 17 Jan 2025
													</p>
													<p className="noti-time">10 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html" className="recent-msg">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<Image alt="Img" src="/assets/img/profiles/avatar-17.jpg" width={30} height={30} />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details">
														Payment of $50 received for Order #67890 from
														<span className="noti-title">Antonio Engle</span>
													</p>
													<p className="noti-time">05 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html" className="recent-msg">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<Image alt="Img" src="/assets/img/profiles/avatar-02.jpg" width={30} height={30} />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details">
														<span className="noti-title">Andrea</span> confirmed his order. Order No: #73401.Estimated
														delivery: 3 days
													</p>
													<p className="noti-time">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
								</ul>
							</div>
							<div className="topnav-dropdown-footer d-flex align-items-center gap-3">
								<a href="#" className="btn btn-secondary btn-md w-100">
									Cancel
								</a>
								<a href="activities.html" className="btn btn-primary btn-md w-100">
									View all
								</a>
							</div>
						</div>
					</li> */}
					{/* <!-- /Notifications --> */}

					<li className="nav-item nav-item-box">
						<a href="general-settings.html">
							<i className="ti ti-settings"></i>
						</a>
					</li>
					<li className="nav-item dropdown has-arrow main-drop profile-nav">
						<a href="#" className="nav-link userset" data-bs-toggle="dropdown">
							<span className="user-info p-0">
								<span className="user-letter">
									<Image
										src="/assets/img/profiles/avator1.jpg"
										alt="Img"
										className="img-fluid"
										width={30}
										height={30}
									/>
								</span>
							</span>
						</a>
						{children}
					</li>
				</ul>
				{/* <!-- /Header Menu --> */}

				{/* <!-- Mobile Menu --> */}
				<div className="dropdown mobile-user-menu">
					<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						<i className="fa fa-ellipsis-v"></i>
					</a>
					<div className="dropdown-menu dropdown-menu-right">
						<a className="dropdown-item" href="profile.html">
							My Profile
						</a>
						<a className="dropdown-item" href="general-settings.html">
							Settings
						</a>
						<a className="dropdown-item" href="signin.html">
							Logout
						</a>
					</div>
				</div>
				{/* <!-- /Mobile Menu --> */}
			</div>
		</div>
	);
}
