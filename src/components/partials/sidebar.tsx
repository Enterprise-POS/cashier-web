'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { signOut } from '@/_lib/action';
import { all_routes as routes } from '@/components/core/data/all_routes';

const excludedPathnames = [routes.login, routes.register];

export default function Sidebar() {
	// I don't use this at 404 because the pathname is unknown
	const router = useRouter();
	const pathname = usePathname();

	const [whileSigningOut, setWhileSigningOut] = useState(false);

	async function handleSignOut() {
		if (whileSigningOut) return;
		setWhileSigningOut(true);

		const { result, error } = await signOut();
		if (error !== null) {
			setWhileSigningOut(false);
			throw new Error(error);
		} else {
			router.push('/login');
			router.refresh();
		}
	}

	let hideSidebar = false;
	if (excludedPathnames.includes(pathname)) {
		hideSidebar = true;
	}

	return (
		<div className={`sidebar ${hideSidebar ? 'sidebar-hide' : ''}`} id="sidebar">
			{/* <!-- Logo --> */}
			<div className="sidebar-logo">
				<Link href="/" className="logo logo-normal">
					{/* <Image src="/favicon.png" alt="Img" width={30} height={30} /> */}
				</Link>
				<Link href="/" className="logo logo-white">
					<Image src="/favicon.png" alt="Img" width={30} height={30} />
				</Link>
				<Link href="/" className="logo-small">
					<Image src="/favicon.png" alt="Img" width={30} height={30} />
				</Link>
				<a id="toggle_btn" href="#">
					<i className="ti ti-chevrons-left"></i>
				</a>
			</div>
			{/* <!-- /Logo --> */}
			<div className="modern-profile p-3 pb-0">
				<div className="text-center rounded bg-light p-3 mb-4 user-profile">
					<div className="avatar avatar-lg online mb-3">
						<Image
							src="/assets/img/customer/customer15.jpg"
							alt="Img"
							className="img-fluid rounded-circle"
							width={300}
							height={300}
						/>
					</div>
					<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
					<p className="fs-12 mb-0">System Admin</p>
				</div>
				<div className="sidebar-nav mb-3">
					<ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent" role="tablist">
						<li className="nav-item">
							<a className="nav-link active border-0" href="#">
								Menu
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link border-0" href="chat.html">
								Chats
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link border-0" href="email.html">
								Inbox
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="sidebar-header p-3 pb-0 pt-2">
				<div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
					<div className="avatar avatar-md onlin">
						<Image
							src="/assets/img/customer/customer15.jpg"
							alt="Img"
							className="img-fluid rounded-circle"
							width={30}
							height={30}
						/>
					</div>
					<div className="text-start sidebar-profile-info ms-2">
						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
						<p className="fs-12">System Admin</p>
					</div>
				</div>
				<div className="d-flex align-items-center justify-content-between menu-item mb-3">
					<div>
						<Link href="index.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-layout-grid-remove"></i>
						</Link>
					</div>
					<div>
						<Link href="chat.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-brand-hipchat"></i>
						</Link>
					</div>
					<div>
						<Link href="email.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-message"></i>
						</Link>
					</div>
					<div className="notification-item">
						<Link href="activities.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-bell"></i>
							<span className="notification-status-dot"></span>
						</Link>
					</div>
					<div className="me-0">
						<Link href="general-settings.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-settings"></i>
						</Link>
					</div>
				</div>
			</div>
			<div className="sidebar-inner slimscroll">
				<div id="sidebar-menu" className="sidebar-menu">
					<ul>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Main</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-layout-grid fs-16 me-2"></i>
										<span>Dashboard</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li className="active">
											<Link href={routes.index}>Admin Dashboard</Link>
										</li>
										<li>
											<Link href="#">Admin Dashboard 2</Link>
										</li>
										<li>
											<Link href="#">Sales Dashboard</Link>
										</li>
									</ul>
								</li>
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-user-edit fs-16 me-2"></i>
										<span>Super Admin</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="dashboard.html">Dashboard</Link>
										</li>
										<li>
											<Link href="companies.html">Companies</Link>
										</li>
										<li>
											<Link href="subscription.html">Subscriptions</Link>
										</li>
										<li>
											<Link href="packages.html">Packages</Link>
										</li>
										<li>
											<Link href="domain.html">Domain</Link>
										</li>
										<li>
											<Link href="purchase-transaction.html">Purchase Transaction</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-brand-apple-arcade fs-16 me-2"></i>
										<span>Application</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="chat.html">Chat</Link>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Call<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="video-call.html">Video Call</Link>
												</li>
												<li>
													<Link href="audio-call.html">Audio Call</Link>
												</li>
												<li>
													<Link href="call-history.html">Call History</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="calendar.html">Calendar</Link>
										</li>
										<li>
											<Link href="contacts.html">Contacts</Link>
										</li>
										<li>
											<Link href="email.html">Email</Link>
										</li>
										<li>
											<Link href="todo.html">To Do</Link>
										</li>
										<li>
											<Link href="notes.html">Notes</Link>
										</li>
										<li>
											<Link href="file-manager.html">File Manager</Link>
										</li>
										<li>
											<Link href="projects.html">Projects</Link>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Ecommerce<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="products.html">Products</Link>
												</li>
												<li>
													<Link href="orders.html">Orders</Link>
												</li>
												<li>
													<Link href="customers.html">Customers</Link>
												</li>
												<li>
													<Link href="cart.html">Cart</Link>
												</li>
												<li>
													<Link href="checkout.html">Checkout</Link>
												</li>
												<li>
													<Link href="wishlist.html">Wishlist</Link>
												</li>
												<li>
													<Link href="reviews.html">Reviews</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="social-feed.html">Social Feed</Link>
										</li>
										<li>
											<Link href="search-list.html">Search List</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-layout-sidebar-right-collapse fs-16 me-2"></i>
										<span>Layouts</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="layout-horizontal.html">Horizontal</Link>
										</li>
										<li>
											<Link href="layout-detached.html">Detached</Link>
										</li>
										<li>
											<Link href="layout-two-column.html">Two Column</Link>
										</li>
										<li>
											<Link href="layout-hovered.html">Hovered</Link>
										</li>
										<li>
											<Link href="layout-boxed.html">Boxed</Link>
										</li>
										<li>
											<Link href="layout-rtl.html">RTL</Link>
										</li>
										<li>
											<Link href="layout-dark.html">Dark</Link>
										</li>
									</ul>
								</li> */}
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Inventory</h6>
							<ul>
								<li>
									<Link href={routes.productList} className={routes.productList === pathname ? 'active' : ''}>
										<i className="ti ti-box fs-16 me-2"></i>
										<span>Products</span>
									</Link>
								</li>
								<li>
									<Link href={routes.addProduct} className={routes.addProduct === pathname ? 'active' : ''}>
										<i className="ti ti-table-plus fs-16 me-2"></i>
										<span>Create Product</span>
									</Link>
								</li>
								<li>
									<Link href={routes.expiredProducts}>
										<i className="ti ti-progress-alert fs-16 me-2"></i>
										<span>Expired Products</span>
									</Link>
								</li>
								<li>
									<Link href={routes.lowStocks}>
										<i className="ti ti-trending-up-2 fs-16 me-2"></i>
										<span>Low Stocks</span>
									</Link>
								</li>
								<li>
									<Link href={routes.categoryList}>
										<i className="ti ti-list-details fs-16 me-2"></i>
										<span>Category</span>
									</Link>
								</li>
								{/* <li>
									<Link href="sub-categories.html">
										<i className="ti ti-carousel-vertical fs-16 me-2"></i>
										<span>Sub Category</span>
									</Link>
								</li> */}
								<li>
									<Link href={routes.brandList}>
										<i className="ti ti-triangles fs-16 me-2"></i>
										<span>Brands</span>
									</Link>
								</li>
								{/* <li>
									<Link href="units.html">
										<i className="ti ti-brand-unity fs-16 me-2"></i>
										<span>Units</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="varriant-attributes.html">
										<i className="ti ti-checklist fs-16 me-2"></i>
										<span>Variant Attributes</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="warranty.html">
										<i className="ti ti-certificate fs-16 me-2"></i>
										<span>Warranties</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="barcode.html">
										<i className="ti ti-barcode fs-16 me-2"></i>
										<span>Print Barcode</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="qrcode.html">
										<i className="ti ti-qrcode fs-16 me-2"></i>
										<span>Print QR Code</span>
									</Link>
								</li> */}
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Stock</h6>
							<ul>
								<li>
									<Link href={routes.manageStocks}>
										<i className="ti ti-stack-3 fs-16 me-2"></i>
										<span>Manage Stocks</span>
									</Link>
								</li>
								<li>
									<Link href={routes.stockAdjustment}>
										<i className="ti ti-stairs-up fs-16 me-2"></i>
										<span>Stock Adjustment</span>
									</Link>
								</li>
								<li>
									<Link href={routes.stockTransfer}>
										<i className="ti ti-stack-pop fs-16 me-2"></i>
										<span>Stock Transfer</span>
									</Link>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Sales</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-layout-grid fs-16 me-2"></i>
										<span>Sales</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href={routes.onlineOrders}>Online Orders</Link>
										</li>
										<li>
											<Link href={routes.posOrders}>POS Orders</Link>
										</li>
									</ul>
								</li>
								{/* <li>
									<Link href="invoice.html">
										<i className="ti ti-file-invoice fs-16 me-2"></i>
										<span>Invoices</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="sales-returns.html">
										<i className="ti ti-receipt-refund fs-16 me-2"></i>
										<span>Sales Return</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="quotation-list.html">
										<i className="ti ti-files fs-16 me-2"></i>
										<span>Quotation</span>
									</Link>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-device-laptop fs-16 me-2"></i>
										<span>POS</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="pos.html">POS 1</Link>
										</li>
										<li>
											<Link href="pos-2.html">POS 2</Link>
										</li>
										<li>
											<Link href="pos-3.html">POS 3</Link>
										</li>
										<li>
											<Link href="pos-4.html">POS 4</Link>
										</li>
										<li>
											<Link href="pos-5.html">POS 5</Link>
										</li>
									</ul>
								</li> */}
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Promo</h6>
							<ul>
								<li>
									<Link href={routes.coupons}>
										<i className="ti ti-ticket fs-16 me-2"></i>
										<span>Coupons</span>
									</Link>
								</li>
								{/* <li>
									<Link href="gift-cards.html">
										<i className="ti ti-cards fs-16 me-2"></i>
										<span>Gift Cards</span>
									</Link>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-file-percent fs-16 me-2"></i>
										<span>Discount</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="discount-plan.html">Discount Plan</Link>
										</li>
										<li>
											<Link href="discount.html">Discount</Link>
										</li>
									</ul>
								</li> */}
							</ul>
						</li>
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">Purchases</h6>
							<ul>
								<li>
									<Link href="purchase-list.html">
										<i className="ti ti-shopping-bag fs-16 me-2"></i>
										<span>Purchases</span>
									</Link>
								</li>
								<li>
									<Link href="purchase-order-report.html">
										<i className="ti ti-file-unknown fs-16 me-2"></i>
										<span>Purchase Order</span>
									</Link>
								</li>
								<li>
									<Link href="purchase-returns.html">
										<i className="ti ti-file-upload fs-16 me-2"></i>
										<span>Purchase Return</span>
									</Link>
								</li>
							</ul>
						</li> */}
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">Finance & Accounts</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-file-stack fs-16 me-2"></i>
										<span>Expenses</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="expense-list.html">Expenses</Link>
										</li>
										<li>
											<Link href="expense-category.html">Expense Category</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-file-pencil fs-16 me-2"></i>
										<span>Income</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="income.html">Income</Link>
										</li>
										<li>
											<Link href="income-category.html">Income Category</Link>
										</li>
									</ul>
								</li>
								<li>
									<Link href="account-list.html">
										<i className="ti ti-building-bank fs-16 me-2"></i>
										<span>Bank Accounts</span>
									</Link>
								</li>
								<li>
									<Link href="money-transfer.html">
										<i className="ti ti-moneybag fs-16 me-2"></i>
										<span>Money Transfer</span>
									</Link>
								</li>
								<li>
									<Link href="balance-sheet.html">
										<i className="ti ti-report-money fs-16 me-2"></i>
										<span>Balance Sheet</span>
									</Link>
								</li>
								<li>
									<Link href="trial-balance.html">
										<i className="ti ti-alert-circle fs-16 me-2"></i>
										<span>Trial Balance</span>
									</Link>
								</li>
								<li>
									<Link href="cash-flow.html">
										<i className="ti ti-zoom-money fs-16 me-2"></i>
										<span>Cash Flow</span>
									</Link>
								</li>
								<li>
									<Link href="account-statement.html">
										<i className="ti ti-file-infinity fs-16 me-2"></i>
										<span>Account Statement</span>
									</Link>
								</li>
							</ul>
						</li> */}
						<li className="submenu-open">
							<h6 className="submenu-hdr">Peoples</h6>
							<ul>
								<li>
									<Link href={routes.customers}>
										<i className="ti ti-users-group fs-16 me-2"></i>
										<span>Customers</span>
									</Link>
								</li>
								{/* <li>
									<Link href="billers.html">
										<i className="ti ti-user-up fs-16 me-2"></i>
										<span>Billers</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="suppliers.html">
										<i className="ti ti-user-dollar fs-16 me-2"></i>
										<span>Suppliers</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="store-list.html">
										<i className="ti ti-home-bolt fs-16 me-2"></i>
										<span>Stores</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="warehouse.html">
										<i className="ti ti-archive fs-16 me-2"></i>
										<span>Warehouses</span>
									</Link>
								</li> */}
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">HRM</h6>
							<ul>
								<li>
									<Link href={routes.employees}>
										<i className="ti ti-user fs-16 me-2"></i>
										<span>Employees</span>
									</Link>
								</li>
								<li>
									<Link href={routes.tenantMembers}>
										<i className="ti ti-archive fs-16 me-2"></i>
										<span>Tenant Members</span>
									</Link>
								</li>
								{/* <li>
									<Link href="department-grid.html">
										<i className="ti ti-compass fs-16 me-2"></i>
										<span>Departments</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="designation.html">
										<i className="ti ti-git-merge fs-16 me-2"></i>
										<span>Designation</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="shift.html">
										<i className="ti ti-arrows-shuffle fs-16 me-2"></i>
										<span>Shifts</span>
									</Link>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-user-cog fs-16 me-2"></i>
										<span>Attendence</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="attendance-employee.html">Employee</Link>
										</li>
										<li>
											<Link href="attendance-admin.html">Admin</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-calendar fs-16 me-2"></i>
										<span>Leaves</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="leaves-admin.html">Admin Leaves</Link>
										</li>
										<li>
											<Link href="leaves-employee.html">Employee Leaves</Link>
										</li>
										<li>
											<Link href="leave-types.html">Leave Types</Link>
										</li>
									</ul>
								</li> */}
								{/* <li>
									<Link href="holidays.html">
										<i className="ti ti-calendar-share fs-16 me-2"></i>
										<span>Holidays</span>
									</Link>
								</li> */}
								{/* <li className="submenu">
									<Link href="employee-salary.html">
										<i className="ti ti-file-dollar fs-16 me-2"></i>
										<span>Payroll</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="employee-salary.html">Employee Salary</Link>
										</li>
										<li>
											<Link href="payslip.html">Payslip</Link>
										</li>
									</ul>
								</li> */}
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Reports</h6>
							<ul>
								<li className="submenu">
									<a className={pathname == routes.salesReport || pathname === routes.bestSeller ? 'subdrop' : ''}>
										<i className="ti ti-chart-bar fs-16 me-2"></i>
										<span>Sales Report</span>
										<span className="menu-arrow"></span>
									</a>
									<ul
										style={pathname == routes.salesReport || pathname === routes.bestSeller ? { display: 'block' } : {}}
									>
										<li>
											<Link href={routes.salesReport} className={routes.salesReport === pathname ? 'active' : ''}>
												Sales Report
											</Link>
										</li>
										<li>
											<Link href={routes.bestSeller} className={routes.bestSeller === pathname ? 'active' : ''}>
												Best Seller
											</Link>
										</li>
									</ul>
								</li>
								<li>
									<Link href={routes.purchaseReport}>
										<i className="ti ti-chart-pie-2 fs-16 me-2"></i>
										<span>Purchase report</span>
									</Link>
								</li>
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-triangle-inverted fs-16 me-2"></i>
										<span>Inventory Report</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="inventory-report.html">Inventory Report</Link>
										</li>
										<li>
											<Link href="stock-history.html">Stock History</Link>
										</li>
										<li>
											<Link href="sold-stock.html">Sold Stock</Link>
										</li>
									</ul>
								</li> */}
								<li>
									<Link href={routes.invoiceReport}>
										<i className="ti ti-businessplan fs-16 me-2"></i>
										<span>Invoice Report</span>
									</Link>
								</li>
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-user-star fs-16 me-2"></i>
										<span>Supplier Report</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="supplier-report.html">Supplier Report</Link>
										</li>
										<li>
											<Link href="supplier-due-report.html">Supplier Due Report</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-report fs-16 me-2"></i>
										<span>Customer Report</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="customer-report.html">Customer Report</Link>
										</li>
										<li>
											<Link href="customer-due-report.html">Customer Due Report</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-report-analytics fs-16 me-2"></i>
										<span>Product Report</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="product-report.html">Product Report</Link>
										</li>
										<li>
											<Link href="product-expiry-report.html">Product Expiry Report</Link>
										</li>
										<li>
											<Link href="product-quantity-alert.html">Product Quantity Alert</Link>
										</li>
									</ul>
								</li> */}
								{/* <li>
									<Link href="expense-report.html">
										<i className="ti ti-file-vector fs-16 me-2"></i>
										<span>Expense Report</span>
									</Link>
								</li> */}
								<li>
									<Link href={routes.incomeReport}>
										<i className="ti ti-chart-ppf fs-16 me-2"></i>
										<span>Income Report</span>
									</Link>
								</li>
								{/* <li>
									<Link href="tax-reports.html">
										<i className="ti ti-chart-dots-2 fs-16 me-2"></i>
										<span>Tax Report</span>
									</Link>
								</li> */}
								<li>
									<Link href={routes.profitAndLoss}>
										<i className="ti ti-chart-donut fs-16 me-2"></i>
										<span>Profit & Loss</span>
									</Link>
								</li>
								<li>
									<Link href={routes.annualReport}>
										<i className="ti ti-report-search fs-16 me-2"></i>
										<span>Annual Report</span>
									</Link>
								</li>
							</ul>
						</li>
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">Content (CMS)</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-page-break fs-16 me-2"></i>
										<span>Pages</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="pages.html">Pages</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-wallpaper fs-16 me-2"></i>
										<span>Blog</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="all-blog.html">All Blog</Link>
										</li>
										<li>
											<Link href="blog-tag.html">Blog Tags</Link>
										</li>
										<li>
											<Link href="blog-categories.html">Categories</Link>
										</li>
										<li>
											<Link href="blog-comments.html">Blog Comments</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-map-pin fs-16 me-2"></i>
										<span>Location</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="countries.html">Countries</Link>
										</li>
										<li>
											<Link href="states.html">States</Link>
										</li>
										<li>
											<Link href="cities.html">Cities</Link>
										</li>
									</ul>
								</li>
								<li>
									<Link href="testimonials.html">
										<i className="ti ti-star fs-16 me-2"></i>
										<span>Testimonials</span>
									</Link>
								</li>
								<li>
									<Link href="faq.html">
										<i className="ti ti-help-circle fs-16 me-2"></i>
										<span>FAQ</span>
									</Link>
								</li>
							</ul>
						</li> */}
						<li className="submenu-open">
							<h6 className="submenu-hdr">User Management</h6>
							<ul>
								<li>
									<Link href={routes.users}>
										<i className="ti ti-shield-up fs-16 me-2"></i>
										<span>Users</span>
									</Link>
								</li>
								{/* <li>
									<Link href="roles-permissions.html">
										<i className="ti ti-jump-rope fs-16 me-2"></i>
										<span>Roles & Permissions</span>
									</Link>
								</li> */}
								{/* <li>
									<Link href="delete-account.html">
										<i className="ti ti-trash-x fs-16 me-2"></i>
										<span>Delete Account Request</span>
									</Link>
								</li> */}
							</ul>
						</li>
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">Pages</h6>
							<ul>
								<li>
									<Link href="profile.html">
										<i className="ti ti-user-circle fs-16 me-2"></i>
										<span>Profile</span>
									</Link>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-shield fs-16 me-2"></i>
										<span>Authentication</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li className="submenu submenu-two">
											<Link href="#">
												Login<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="signin.html">Cover</Link>
												</li>
												<li>
													<Link href="signin-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="signin-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Register<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="register.html">Cover</Link>
												</li>
												<li>
													<Link href="register-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="register-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Forgot Password<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="forgot-password.html">Cover</Link>
												</li>
												<li>
													<Link href="forgot-password-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="forgot-password-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Reset Password<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="reset-password.html">Cover</Link>
												</li>
												<li>
													<Link href="reset-password-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="reset-password-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Email Verification<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="email-verification.html">Cover</Link>
												</li>
												<li>
													<Link href="email-verification-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="email-verification-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												2 Step Verification<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="two-step-verification.html">Cover</Link>
												</li>
												<li>
													<Link href="two-step-verification-2.html">Illustration</Link>
												</li>
												<li>
													<Link href="two-step-verification-3.html">Basic</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="lock-screen.html">Lock Screen</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-file-x fs-16 me-2"></i>
										<span>Error Pages</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="error-404.html">404 Error </Link>
										</li>
										<li>
											<Link href="error-500.html">500 Error </Link>
										</li>
									</ul>
								</li>
								<li className={pathname === routes.blankpage ? 'active' : ''}>
									<Link href={routes.blankpage}>
										<i className="ti ti-file fs-16 me-2"></i>
										<span>Blank Page</span>{' '}
									</Link>
								</li>
								<li>
									<Link href="pricing.html">
										<i className="ti ti-currency-dollar fs-16 me-2"></i>
										<span>Pricing</span>{' '}
									</Link>
								</li>
								<li>
									<Link href="coming-soon.html">
										<i className="ti ti-send fs-16 me-2"></i>
										<span>Coming Soon</span>{' '}
									</Link>
								</li>
								<li>
									<Link href="under-maintenance.html">
										<i className="ti ti-alert-triangle fs-16 me-2"></i>
										<span>Under Maintenance</span>
									</Link>
								</li>
							</ul>
						</li> */}
						<li className="submenu-open">
							<h6 className="submenu-hdr">Settings</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-settings fs-16 me-2"></i>
										<span>General Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href={routes.profileSettings}>Profile</Link>
										</li>
										{/* <li>
											<Link href="security-settings.html">Security</Link>
										</li> */}
										{/* <li>
											<Link href="notification.html">Notifications</Link>
										</li> */}
										{/* <li>
											<Link href="connected-apps.html">Connected Apps</Link>
										</li> */}
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-world fs-16 me-2"></i>
										<span>Website Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										{/* <li>
											<Link href="system-settings.html">System Settings</Link>
										</li> */}
										<li>
											<Link href="company-settings.html">Company Settings </Link>
										</li>
										{/* <li>
											<Link href="localization-settings.html">Localization</Link>
										</li>
										<li>
											<Link href="prefixes.html">Prefixes</Link>
										</li>
										<li>
											<Link href="preference.html">Preference</Link>
										</li>
										<li>
											<Link href="appearance.html">Appearance</Link>
										</li>
										<li>
											<Link href="social-authentication.html">Social Authentication</Link>
										</li> */}
										<li>
											<Link href={routes.languageSettings}>Language</Link>
										</li>
									</ul>
								</li>
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-device-mobile fs-16 me-2"></i> <span>App Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li className="submenu submenu-two">
											<Link href="#">
												Invoice<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="invoice-settings.html">Invoice Settings</Link>
												</li>
												<li>
													<Link href="invoice-template.html">Invoice Template</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="printer-settings.html">Printer</Link>
										</li>
										<li>
											<Link href="pos-settings.html">POS</Link>
										</li>
										<li>
											<Link href="custom-fields.html">Custom Fields</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-device-desktop fs-16 me-2"></i> <span>System Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li className="submenu submenu-two">
											<Link href="#">
												Email<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="email-settings.html">Email Settings</Link>
												</li>
												<li>
													<Link href="email-template.html">Email Template</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												SMS<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="sms-settings.html">SMS Settings</Link>
												</li>
												<li>
													<Link href="sms-template.html">SMS Template</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="otp-settings.html">OTP</Link>
										</li>
										<li>
											<Link href="gdpr-settings.html">GDPR Cookies</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-settings-dollar fs-16 me-2"></i> <span>Financial Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="payment-gateway-settings.html">Payment Gateway</Link>
										</li>
										<li>
											<Link href="bank-settings-grid.html">Bank Accounts</Link>
										</li>
										<li>
											<Link href="tax-rates.html">Tax Rates</Link>
										</li>
										<li>
											<Link href="currency-settings.html">Currencies</Link>
										</li>
									</ul>
								</li> */}
								{/* <li className="submenu">
									<Link href="#">
										<i className="ti ti-settings-2 fs-16 me-2"></i> <span>Other Settings</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="storage-settings.html">Storage</Link>
										</li>
										<li>
											<Link href="ban-ip-address.html">Ban IP Address</Link>
										</li>
									</ul>
								</li> */}
								<li>
									<Link
										href={routes.login}
										onClick={event => {
											event.preventDefault();
											handleSignOut();
										}}
									>
										<i className="ti ti-logout fs-16 me-2"></i>
										<span>Logout</span>{' '}
									</Link>
								</li>
							</ul>
						</li>
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">UI Interface</h6>
							<ul>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-vector-bezier fs-16 me-2"></i>
										<span>Base UI</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="ui-alerts.html">Alerts</Link>
										</li>
										<li>
											<Link href="ui-accordion.html">Accordion</Link>
										</li>
										<li>
											<Link href="ui-avatar.html">Avatar</Link>
										</li>
										<li>
											<Link href="ui-badges.html">Badges</Link>
										</li>
										<li>
											<Link href="ui-borders.html">Border</Link>
										</li>
										<li>
											<Link href="ui-buttons.html">Buttons</Link>
										</li>
										<li>
											<Link href="ui-buttons-group.html">Button Group</Link>
										</li>
										<li>
											<Link href="ui-breadcrumb.html">Breadcrumb</Link>
										</li>
										<li>
											<Link href="ui-cards.html">Card</Link>
										</li>
										<li>
											<Link href="ui-carousel.html">Carousel</Link>
										</li>
										<li>
											<Link href="ui-colors.html">Colors</Link>
										</li>
										<li>
											<Link href="ui-dropdowns.html">Dropdowns</Link>
										</li>
										<li>
											<Link href="ui-grid.html">Grid</Link>
										</li>
										<li>
											<Link href="ui-images.html">Images</Link>
										</li>
										<li>
											<Link href="ui-lightbox.html">Lightbox</Link>
										</li>
										<li>
											<Link href="ui-media.html">Media</Link>
										</li>
										<li>
											<Link href="ui-modals.html">Modals</Link>
										</li>
										<li>
											<Link href="ui-offcanvas.html">Offcanvas</Link>
										</li>
										<li>
											<Link href="ui-pagination.html">Pagination</Link>
										</li>
										<li>
											<Link href="ui-popovers.html">Popovers</Link>
										</li>
										<li>
											<Link href="ui-progress.html">Progress</Link>
										</li>
										<li>
											<Link href="ui-placeholders.html">Placeholders</Link>
										</li>
										<li>
											<Link href="ui-rangeslider.html">Range Slider</Link>
										</li>
										<li>
											<Link href="ui-spinner.html">Spinner</Link>
										</li>
										<li>
											<Link href="ui-sweetalerts.html">Sweet Alerts</Link>
										</li>
										<li>
											<Link href="ui-nav-tabs.html">Tabs</Link>
										</li>
										<li>
											<Link href="ui-toasts.html">Toasts</Link>
										</li>
										<li>
											<Link href="ui-tooltips.html">Tooltips</Link>
										</li>
										<li>
											<Link href="ui-typography.html">Typography</Link>
										</li>
										<li>
											<Link href="ui-video.html">Video</Link>
										</li>
										<li>
											<Link href="ui-sortable.html">Sortable</Link>
										</li>
										<li>
											<Link href="ui-swiperjs.html">Swiperjs</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i data-feather="layers"></i>
										<span>Advanced UI</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="ui-ribbon.html">Ribbon</Link>
										</li>
										<li>
											<Link href="ui-clipboard.html">Clipboard</Link>
										</li>
										<li>
											<Link href="ui-drag-drop.html">Drag & Drop</Link>
										</li>
										<li>
											<Link href="ui-rangeslider.html">Range Slider</Link>
										</li>
										<li>
											<Link href="ui-rating.html">Rating</Link>
										</li>
										<li>
											<Link href="ui-text-editor.html">Text Editor</Link>
										</li>
										<li>
											<Link href="ui-counter.html">Counter</Link>
										</li>
										<li>
											<Link href="ui-scrollbar.html">Scrollbar</Link>
										</li>
										<li>
											<Link href="ui-stickynote.html">Sticky Note</Link>
										</li>
										<li>
											<Link href="ui-timeline.html">Timeline</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-chart-infographic fs-16 me-2"></i> <span>Charts</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="chart-apex.html">Apex Charts</Link>
										</li>
										<li>
											<Link href="chart-c3.html">Chart C3</Link>
										</li>
										<li>
											<Link href="chart-js.html">Chart Js</Link>
										</li>
										<li>
											<Link href="chart-morris.html">Morris Charts</Link>
										</li>
										<li>
											<Link href="chart-flot.html">Flot Charts</Link>
										</li>
										<li>
											<Link href="chart-peity.html">Peity Charts</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-icons fs-16 me-2"></i> <span>Icons</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="icon-fontawesome.html">Fontawesome Icons</Link>
										</li>
										<li>
											<Link href="icon-feather.html">Feather Icons</Link>
										</li>
										<li>
											<Link href="icon-ionic.html">Ionic Icons</Link>
										</li>
										<li>
											<Link href="icon-material.html">Material Icons</Link>
										</li>
										<li>
											<Link href="icon-pe7.html">Pe7 Icons</Link>
										</li>
										<li>
											<Link href="icon-simpleline.html">Simpleline Icons</Link>
										</li>
										<li>
											<Link href="icon-themify.html">Themify Icons</Link>
										</li>
										<li>
											<Link href="icon-weather.html">Weather Icons</Link>
										</li>
										<li>
											<Link href="icon-typicon.html">Typicon Icons</Link>
										</li>
										<li>
											<Link href="icon-flag.html">Flag Icons</Link>
										</li>
										<li>
											<Link href="icon-tabler.html">Tabler Icons</Link>
										</li>
										<li>
											<Link href="icon-bootstrap.html">Bootstrap Icons</Link>
										</li>
										<li>
											<Link href="icon-remix.html">Remix Icons</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-input-search fs-16 me-2"></i>
										<span>Forms</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li className="submenu submenu-two">
											<Link href="#">
												Form Elements<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="form-basic-inputs.html">Basic Inputs</Link>
												</li>
												<li>
													<Link href="form-checkbox-radios.html">Checkbox & Radios</Link>
												</li>
												<li>
													<Link href="form-input-groups.html">Input Groups</Link>
												</li>
												<li>
													<Link href="form-grid-gutters.html">Grid & Gutters</Link>
												</li>
												<li>
													<Link href="form-select.html">Form Select</Link>
												</li>
												<li>
													<Link href="form-mask.html">Input Masks</Link>
												</li>
												<li>
													<Link href="form-fileupload.html">File Uploads</Link>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Layouts<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="form-horizontal.html">Horizontal Form</Link>
												</li>
												<li>
													<Link href="form-vertical.html">Vertical Form</Link>
												</li>
												<li>
													<Link href="form-floating-labels.html">Floating Labels</Link>
												</li>
											</ul>
										</li>
										<li>
											<Link href="form-validation.html">Form Validation</Link>
										</li>
										<li>
											<Link href="form-select2.html">Select2</Link>
										</li>
										<li>
											<Link href="form-wizard.html">Form Wizard</Link>
										</li>
										<li>
											<Link href="form-pickers.html">Form Picker</Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-table fs-16 me-2"></i>
										<span>Tables</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="tables-basic.html">Basic Tables </Link>
										</li>
										<li>
											<Link href="data-tables.html">Data Table </Link>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-map-pin-pin fs-16 me-2"></i>
										<span>Maps</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="maps-vector.html">Vector</Link>
										</li>
										<li>
											<Link href="maps-leaflet.html">Leaflet</Link>
										</li>
									</ul>
								</li>
							</ul>
						</li> */}
						{/* <li className="submenu-open">
							<h6 className="submenu-hdr">Help</h6>
							<ul>
								<li>
									<Link href="#">
										<i className="ti ti-file-text fs-16 me-2"></i>
										<span>Documentation</span>
									</Link>
								</li>
								<li>
									<Link href="#">
										<i className="ti ti-exchange fs-16 me-2"></i>
										<span>Changelog </span>
										<span className="badge bg-primary badge-xs text-white fs-10 ms-2">v2.1.3</span>
									</Link>
								</li>
								<li className="submenu">
									<Link href="#">
										<i className="ti ti-menu-2 fs-16 me-2"></i>
										<span>Multi Level</span>
										<span className="menu-arrow"></span>
									</Link>
									<ul>
										<li>
											<Link href="#">Level 1.1</Link>
										</li>
										<li className="submenu submenu-two">
											<Link href="#">
												Level 1.2<span className="menu-arrow inside-submenu"></span>
											</Link>
											<ul>
												<li>
													<Link href="#">Level 2.1</Link>
												</li>
												<li className="submenu submenu-two submenu-three">
													<Link href="#">
														Level 2.2<span className="menu-arrow inside-submenu inside-submenu-two"></span>
													</Link>
													<ul>
														<li>
															<Link href="#">Level 3.1</Link>
														</li>
														<li>
															<Link href="#">Level 3.2</Link>
														</li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li> */}
					</ul>
				</div>
			</div>
		</div>
	);
}
