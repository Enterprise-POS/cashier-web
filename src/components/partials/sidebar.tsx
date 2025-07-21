'use client';

import Image from 'next/image';
import { all_routes } from '../core/data/all_routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation.js';

export default function Sidebar() {
	const routes = all_routes;
	const pathname = usePathname();

	return (
		<div className="sidebar" id="sidebar">
			{/* <!-- Logo --> */}
			<div className="sidebar-logo">
				<a href="index.html" className="logo logo-normal">
					<Image src="/assets/img/logo.svg" alt="Img" width={30} height={30} />
				</a>
				<a href="index.html" className="logo logo-white">
					<Image src="/assets/img/logo-white.svg" alt="Img" width={30} height={30} />
				</a>
				<a href="index.html" className="logo-small">
					<Image src="/assets/img/logo-small.png" alt="Img" width={30} height={30} />
				</a>
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
						<a href="index.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-layout-grid-remove"></i>
						</a>
					</div>
					<div>
						<a href="chat.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-brand-hipchat"></i>
						</a>
					</div>
					<div>
						<a href="email.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-message"></i>
						</a>
					</div>
					<div className="notification-item">
						<a href="activities.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-bell"></i>
							<span className="notification-status-dot"></span>
						</a>
					</div>
					<div className="me-0">
						<a href="general-settings.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-settings"></i>
						</a>
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
									<a href="#">
										<i className="ti ti-layout-grid fs-16 me-2"></i>
										<span>Dashboard</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li className="active">
											<Link href={routes.index}>Admin Dashboard</Link>
										</li>
										<li>
											<a href="admin-dashboard.html">Admin Dashboard 2</a>
										</li>
										<li>
											<a href="sales-dashboard.html">Sales Dashboard</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-user-edit fs-16 me-2"></i>
										<span>Super Admin</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="dashboard.html">Dashboard</a>
										</li>
										<li>
											<a href="companies.html">Companies</a>
										</li>
										<li>
											<a href="subscription.html">Subscriptions</a>
										</li>
										<li>
											<a href="packages.html">Packages</a>
										</li>
										<li>
											<a href="domain.html">Domain</a>
										</li>
										<li>
											<a href="purchase-transaction.html">Purchase Transaction</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-brand-apple-arcade fs-16 me-2"></i>
										<span>Application</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="chat.html">Chat</a>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Call<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="video-call.html">Video Call</a>
												</li>
												<li>
													<a href="audio-call.html">Audio Call</a>
												</li>
												<li>
													<a href="call-history.html">Call History</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="calendar.html">Calendar</a>
										</li>
										<li>
											<a href="contacts.html">Contacts</a>
										</li>
										<li>
											<a href="email.html">Email</a>
										</li>
										<li>
											<a href="todo.html">To Do</a>
										</li>
										<li>
											<a href="notes.html">Notes</a>
										</li>
										<li>
											<a href="file-manager.html">File Manager</a>
										</li>
										<li>
											<a href="projects.html">Projects</a>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Ecommerce<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="products.html">Products</a>
												</li>
												<li>
													<a href="orders.html">Orders</a>
												</li>
												<li>
													<a href="customers.html">Customers</a>
												</li>
												<li>
													<a href="cart.html">Cart</a>
												</li>
												<li>
													<a href="checkout.html">Checkout</a>
												</li>
												<li>
													<a href="wishlist.html">Wishlist</a>
												</li>
												<li>
													<a href="reviews.html">Reviews</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="social-feed.html">Social Feed</a>
										</li>
										<li>
											<a href="search-list.html">Search List</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-layout-sidebar-right-collapse fs-16 me-2"></i>
										<span>Layouts</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="layout-horizontal.html">Horizontal</a>
										</li>
										<li>
											<a href="layout-detached.html">Detached</a>
										</li>
										<li>
											<a href="layout-two-column.html">Two Column</a>
										</li>
										<li>
											<a href="layout-hovered.html">Hovered</a>
										</li>
										<li>
											<a href="layout-boxed.html">Boxed</a>
										</li>
										<li>
											<a href="layout-rtl.html">RTL</a>
										</li>
										<li>
											<a href="layout-dark.html">Dark</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Inventory</h6>
							<ul>
								<li>
									<a href="product-list.html">
										<i className="ti ti-box fs-16 me-2"></i>
										<span>Products</span>
									</a>
								</li>
								<li>
									<Link href={routes.addProduct}>
										<i className="ti ti-table-plus fs-16 me-2"></i>
										<span>Create Product</span>
									</Link>
								</li>
								<li>
									<a href="expired-products.html">
										<i className="ti ti-progress-alert fs-16 me-2"></i>
										<span>Expired Products</span>
									</a>
								</li>
								<li>
									<a href="low-stocks.html">
										<i className="ti ti-trending-up-2 fs-16 me-2"></i>
										<span>Low Stocks</span>
									</a>
								</li>
								<li>
									<a href="category-list.html">
										<i className="ti ti-list-details fs-16 me-2"></i>
										<span>Category</span>
									</a>
								</li>
								<li>
									<a href="sub-categories.html">
										<i className="ti ti-carousel-vertical fs-16 me-2"></i>
										<span>Sub Category</span>
									</a>
								</li>
								<li>
									<a href="brand-list.html">
										<i className="ti ti-triangles fs-16 me-2"></i>
										<span>Brands</span>
									</a>
								</li>
								<li>
									<a href="units.html">
										<i className="ti ti-brand-unity fs-16 me-2"></i>
										<span>Units</span>
									</a>
								</li>
								<li>
									<a href="varriant-attributes.html">
										<i className="ti ti-checklist fs-16 me-2"></i>
										<span>Variant Attributes</span>
									</a>
								</li>
								<li>
									<a href="warranty.html">
										<i className="ti ti-certificate fs-16 me-2"></i>
										<span>Warranties</span>
									</a>
								</li>
								<li>
									<a href="barcode.html">
										<i className="ti ti-barcode fs-16 me-2"></i>
										<span>Print Barcode</span>
									</a>
								</li>
								<li>
									<a href="qrcode.html">
										<i className="ti ti-qrcode fs-16 me-2"></i>
										<span>Print QR Code</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Stock</h6>
							<ul>
								<li>
									<a href="manage-stocks.html">
										<i className="ti ti-stack-3 fs-16 me-2"></i>
										<span>Manage Stock</span>
									</a>
								</li>
								<li>
									<a href="stock-adjustment.html">
										<i className="ti ti-stairs-up fs-16 me-2"></i>
										<span>Stock Adjustment</span>
									</a>
								</li>
								<li>
									<a href="stock-transfer.html">
										<i className="ti ti-stack-pop fs-16 me-2"></i>
										<span>Stock Transfer</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Sales</h6>
							<ul>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-layout-grid fs-16 me-2"></i>
										<span>Sales</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="online-orders.html">Online Orders</a>
										</li>
										<li>
											<a href="pos-orders.html">POS Orders</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="invoice.html">
										<i className="ti ti-file-invoice fs-16 me-2"></i>
										<span>Invoices</span>
									</a>
								</li>
								<li>
									<a href="sales-returns.html">
										<i className="ti ti-receipt-refund fs-16 me-2"></i>
										<span>Sales Return</span>
									</a>
								</li>
								<li>
									<a href="quotation-list.html">
										<i className="ti ti-files fs-16 me-2"></i>
										<span>Quotation</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-device-laptop fs-16 me-2"></i>
										<span>POS</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="pos.html">POS 1</a>
										</li>
										<li>
											<a href="pos-2.html">POS 2</a>
										</li>
										<li>
											<a href="pos-3.html">POS 3</a>
										</li>
										<li>
											<a href="pos-4.html">POS 4</a>
										</li>
										<li>
											<a href="pos-5.html">POS 5</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Promo</h6>
							<ul>
								<li>
									<a href="coupons.html">
										<i className="ti ti-ticket fs-16 me-2"></i>
										<span>Coupons</span>
									</a>
								</li>
								<li>
									<a href="gift-cards.html">
										<i className="ti ti-cards fs-16 me-2"></i>
										<span>Gift Cards</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-file-percent fs-16 me-2"></i>
										<span>Discount</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="discount-plan.html">Discount Plan</a>
										</li>
										<li>
											<a href="discount.html">Discount</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Purchases</h6>
							<ul>
								<li>
									<a href="purchase-list.html">
										<i className="ti ti-shopping-bag fs-16 me-2"></i>
										<span>Purchases</span>
									</a>
								</li>
								<li>
									<a href="purchase-order-report.html">
										<i className="ti ti-file-unknown fs-16 me-2"></i>
										<span>Purchase Order</span>
									</a>
								</li>
								<li>
									<a href="purchase-returns.html">
										<i className="ti ti-file-upload fs-16 me-2"></i>
										<span>Purchase Return</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Finance & Accounts</h6>
							<ul>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-file-stack fs-16 me-2"></i>
										<span>Expenses</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="expense-list.html">Expenses</a>
										</li>
										<li>
											<a href="expense-category.html">Expense Category</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-file-pencil fs-16 me-2"></i>
										<span>Income</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="income.html">Income</a>
										</li>
										<li>
											<a href="income-category.html">Income Category</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="account-list.html">
										<i className="ti ti-building-bank fs-16 me-2"></i>
										<span>Bank Accounts</span>
									</a>
								</li>
								<li>
									<a href="money-transfer.html">
										<i className="ti ti-moneybag fs-16 me-2"></i>
										<span>Money Transfer</span>
									</a>
								</li>
								<li>
									<a href="balance-sheet.html">
										<i className="ti ti-report-money fs-16 me-2"></i>
										<span>Balance Sheet</span>
									</a>
								</li>
								<li>
									<a href="trial-balance.html">
										<i className="ti ti-alert-circle fs-16 me-2"></i>
										<span>Trial Balance</span>
									</a>
								</li>
								<li>
									<a href="cash-flow.html">
										<i className="ti ti-zoom-money fs-16 me-2"></i>
										<span>Cash Flow</span>
									</a>
								</li>
								<li>
									<a href="account-statement.html">
										<i className="ti ti-file-infinity fs-16 me-2"></i>
										<span>Account Statement</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Peoples</h6>
							<ul>
								<li>
									<a href="customers.html">
										<i className="ti ti-users-group fs-16 me-2"></i>
										<span>Customers</span>
									</a>
								</li>
								<li>
									<a href="billers.html">
										<i className="ti ti-user-up fs-16 me-2"></i>
										<span>Billers</span>
									</a>
								</li>
								<li>
									<a href="suppliers.html">
										<i className="ti ti-user-dollar fs-16 me-2"></i>
										<span>Suppliers</span>
									</a>
								</li>
								<li>
									<a href="store-list.html">
										<i className="ti ti-home-bolt fs-16 me-2"></i>
										<span>Stores</span>
									</a>
								</li>
								<li>
									<a href="warehouse.html">
										<i className="ti ti-archive fs-16 me-2"></i>
										<span>Warehouses</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">HRM</h6>
							<ul>
								<li>
									<a href="employees-grid.html">
										<i className="ti ti-user fs-16 me-2"></i>
										<span>Employees</span>
									</a>
								</li>
								<li>
									<a href="department-grid.html">
										<i className="ti ti-compass fs-16 me-2"></i>
										<span>Departments</span>
									</a>
								</li>
								<li>
									<a href="designation.html">
										<i className="ti ti-git-merge fs-16 me-2"></i>
										<span>Designation</span>
									</a>
								</li>
								<li>
									<a href="shift.html">
										<i className="ti ti-arrows-shuffle fs-16 me-2"></i>
										<span>Shifts</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-user-cog fs-16 me-2"></i>
										<span>Attendence</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="attendance-employee.html">Employee</a>
										</li>
										<li>
											<a href="attendance-admin.html">Admin</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-calendar fs-16 me-2"></i>
										<span>Leaves</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="leaves-admin.html">Admin Leaves</a>
										</li>
										<li>
											<a href="leaves-employee.html">Employee Leaves</a>
										</li>
										<li>
											<a href="leave-types.html">Leave Types</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="holidays.html">
										<i className="ti ti-calendar-share fs-16 me-2"></i>
										<span>Holidays</span>
									</a>
								</li>
								<li className="submenu">
									<a href="employee-salary.html">
										<i className="ti ti-file-dollar fs-16 me-2"></i>
										<span>Payroll</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="employee-salary.html">Employee Salary</a>
										</li>
										<li>
											<a href="payslip.html">Payslip</a>
										</li>
									</ul>
								</li>
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
									<a href="purchase-report.html">
										<i className="ti ti-chart-pie-2 fs-16 me-2"></i>
										<span>Purchase report</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-triangle-inverted fs-16 me-2"></i>
										<span>Inventory Report</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="inventory-report.html">Inventory Report</a>
										</li>
										<li>
											<a href="stock-history.html">Stock History</a>
										</li>
										<li>
											<a href="sold-stock.html">Sold Stock</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="invoice-report.html">
										<i className="ti ti-businessplan fs-16 me-2"></i>
										<span>Invoice Report</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-user-star fs-16 me-2"></i>
										<span>Supplier Report</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="supplier-report.html">Supplier Report</a>
										</li>
										<li>
											<a href="supplier-due-report.html">Supplier Due Report</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-report fs-16 me-2"></i>
										<span>Customer Report</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="customer-report.html">Customer Report</a>
										</li>
										<li>
											<a href="customer-due-report.html">Customer Due Report</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-report-analytics fs-16 me-2"></i>
										<span>Product Report</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="product-report.html">Product Report</a>
										</li>
										<li>
											<a href="product-expiry-report.html">Product Expiry Report</a>
										</li>
										<li>
											<a href="product-quantity-alert.html">Product Quantity Alert</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="expense-report.html">
										<i className="ti ti-file-vector fs-16 me-2"></i>
										<span>Expense Report</span>
									</a>
								</li>
								<li>
									<a href="income-report.html">
										<i className="ti ti-chart-ppf fs-16 me-2"></i>
										<span>Income Report</span>
									</a>
								</li>
								<li>
									<a href="tax-reports.html">
										<i className="ti ti-chart-dots-2 fs-16 me-2"></i>
										<span>Tax Report</span>
									</a>
								</li>
								<li>
									<a href="profit-and-loss.html">
										<i className="ti ti-chart-donut fs-16 me-2"></i>
										<span>Profit & Loss</span>
									</a>
								</li>
								<li>
									<a href="annual-report.html">
										<i className="ti ti-report-search fs-16 me-2"></i>
										<span>Annual Report</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Content (CMS)</h6>
							<ul>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-page-break fs-16 me-2"></i>
										<span>Pages</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="pages.html">Pages</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-wallpaper fs-16 me-2"></i>
										<span>Blog</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="all-blog.html">All Blog</a>
										</li>
										<li>
											<a href="blog-tag.html">Blog Tags</a>
										</li>
										<li>
											<a href="blog-categories.html">Categories</a>
										</li>
										<li>
											<a href="blog-comments.html">Blog Comments</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-map-pin fs-16 me-2"></i>
										<span>Location</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="countries.html">Countries</a>
										</li>
										<li>
											<a href="states.html">States</a>
										</li>
										<li>
											<a href="cities.html">Cities</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="testimonials.html">
										<i className="ti ti-star fs-16 me-2"></i>
										<span>Testimonials</span>
									</a>
								</li>
								<li>
									<a href="faq.html">
										<i className="ti ti-help-circle fs-16 me-2"></i>
										<span>FAQ</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">User Management</h6>
							<ul>
								<li>
									<a href="users.html">
										<i className="ti ti-shield-up fs-16 me-2"></i>
										<span>Users</span>
									</a>
								</li>
								<li>
									<a href="roles-permissions.html">
										<i className="ti ti-jump-rope fs-16 me-2"></i>
										<span>Roles & Permissions</span>
									</a>
								</li>
								<li>
									<a href="delete-account.html">
										<i className="ti ti-trash-x fs-16 me-2"></i>
										<span>Delete Account Request</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Pages</h6>
							<ul>
								<li>
									<a href="profile.html">
										<i className="ti ti-user-circle fs-16 me-2"></i>
										<span>Profile</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-shield fs-16 me-2"></i>
										<span>Authentication</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li className="submenu submenu-two">
											<a href="#">
												Login<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="signin.html">Cover</a>
												</li>
												<li>
													<a href="signin-2.html">Illustration</a>
												</li>
												<li>
													<a href="signin-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Register<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="register.html">Cover</a>
												</li>
												<li>
													<a href="register-2.html">Illustration</a>
												</li>
												<li>
													<a href="register-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Forgot Password<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="forgot-password.html">Cover</a>
												</li>
												<li>
													<a href="forgot-password-2.html">Illustration</a>
												</li>
												<li>
													<a href="forgot-password-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Reset Password<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="reset-password.html">Cover</a>
												</li>
												<li>
													<a href="reset-password-2.html">Illustration</a>
												</li>
												<li>
													<a href="reset-password-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Email Verification<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="email-verification.html">Cover</a>
												</li>
												<li>
													<a href="email-verification-2.html">Illustration</a>
												</li>
												<li>
													<a href="email-verification-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												2 Step Verification<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="two-step-verification.html">Cover</a>
												</li>
												<li>
													<a href="two-step-verification-2.html">Illustration</a>
												</li>
												<li>
													<a href="two-step-verification-3.html">Basic</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="lock-screen.html">Lock Screen</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-file-x fs-16 me-2"></i>
										<span>Error Pages</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="error-404.html">404 Error </a>
										</li>
										<li>
											<a href="error-500.html">500 Error </a>
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
									<a href="pricing.html">
										<i className="ti ti-currency-dollar fs-16 me-2"></i>
										<span>Pricing</span>{' '}
									</a>
								</li>
								<li>
									<a href="coming-soon.html">
										<i className="ti ti-send fs-16 me-2"></i>
										<span>Coming Soon</span>{' '}
									</a>
								</li>
								<li>
									<a href="under-maintenance.html">
										<i className="ti ti-alert-triangle fs-16 me-2"></i>
										<span>Under Maintenance</span>
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Settings</h6>
							<ul>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-settings fs-16 me-2"></i>
										<span>General Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="general-settings.html">Profile</a>
										</li>
										<li>
											<a href="security-settings.html">Security</a>
										</li>
										<li>
											<a href="notification.html">Notifications</a>
										</li>
										<li>
											<a href="connected-apps.html">Connected Apps</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-world fs-16 me-2"></i>
										<span>Website Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="system-settings.html">System Settings</a>
										</li>
										<li>
											<a href="company-settings.html">Company Settings </a>
										</li>
										<li>
											<a href="localization-settings.html">Localization</a>
										</li>
										<li>
											<a href="prefixes.html">Prefixes</a>
										</li>
										<li>
											<a href="preference.html">Preference</a>
										</li>
										<li>
											<a href="appearance.html">Appearance</a>
										</li>
										<li>
											<a href="social-authentication.html">Social Authentication</a>
										</li>
										<li>
											<a href="language-settings.html">Language</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-device-mobile fs-16 me-2"></i> <span>App Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li className="submenu submenu-two">
											<a href="#">
												Invoice<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="invoice-settings.html">Invoice Settings</a>
												</li>
												<li>
													<a href="invoice-template.html">Invoice Template</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="printer-settings.html">Printer</a>
										</li>
										<li>
											<a href="pos-settings.html">POS</a>
										</li>
										<li>
											<a href="custom-fields.html">Custom Fields</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-device-desktop fs-16 me-2"></i> <span>System Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li className="submenu submenu-two">
											<a href="#">
												Email<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="email-settings.html">Email Settings</a>
												</li>
												<li>
													<a href="email-template.html">Email Template</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												SMS<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="sms-settings.html">SMS Settings</a>
												</li>
												<li>
													<a href="sms-template.html">SMS Template</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="otp-settings.html">OTP</a>
										</li>
										<li>
											<a href="gdpr-settings.html">GDPR Cookies</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-settings-dollar fs-16 me-2"></i> <span>Financial Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="payment-gateway-settings.html">Payment Gateway</a>
										</li>
										<li>
											<a href="bank-settings-grid.html">Bank Accounts</a>
										</li>
										<li>
											<a href="tax-rates.html">Tax Rates</a>
										</li>
										<li>
											<a href="currency-settings.html">Currencies</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-settings-2 fs-16 me-2"></i> <span>Other Settings</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="storage-settings.html">Storage</a>
										</li>
										<li>
											<a href="ban-ip-address.html">Ban IP Address</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="signin.html">
										<i className="ti ti-logout fs-16 me-2"></i>
										<span>Logout</span>{' '}
									</a>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">UI Interface</h6>
							<ul>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-vector-bezier fs-16 me-2"></i>
										<span>Base UI</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="ui-alerts.html">Alerts</a>
										</li>
										<li>
											<a href="ui-accordion.html">Accordion</a>
										</li>
										<li>
											<a href="ui-avatar.html">Avatar</a>
										</li>
										<li>
											<a href="ui-badges.html">Badges</a>
										</li>
										<li>
											<a href="ui-borders.html">Border</a>
										</li>
										<li>
											<a href="ui-buttons.html">Buttons</a>
										</li>
										<li>
											<a href="ui-buttons-group.html">Button Group</a>
										</li>
										<li>
											<a href="ui-breadcrumb.html">Breadcrumb</a>
										</li>
										<li>
											<a href="ui-cards.html">Card</a>
										</li>
										<li>
											<a href="ui-carousel.html">Carousel</a>
										</li>
										<li>
											<a href="ui-colors.html">Colors</a>
										</li>
										<li>
											<a href="ui-dropdowns.html">Dropdowns</a>
										</li>
										<li>
											<a href="ui-grid.html">Grid</a>
										</li>
										<li>
											<a href="ui-images.html">Images</a>
										</li>
										<li>
											<a href="ui-lightbox.html">Lightbox</a>
										</li>
										<li>
											<a href="ui-media.html">Media</a>
										</li>
										<li>
											<a href="ui-modals.html">Modals</a>
										</li>
										<li>
											<a href="ui-offcanvas.html">Offcanvas</a>
										</li>
										<li>
											<a href="ui-pagination.html">Pagination</a>
										</li>
										<li>
											<a href="ui-popovers.html">Popovers</a>
										</li>
										<li>
											<a href="ui-progress.html">Progress</a>
										</li>
										<li>
											<a href="ui-placeholders.html">Placeholders</a>
										</li>
										<li>
											<a href="ui-rangeslider.html">Range Slider</a>
										</li>
										<li>
											<a href="ui-spinner.html">Spinner</a>
										</li>
										<li>
											<a href="ui-sweetalerts.html">Sweet Alerts</a>
										</li>
										<li>
											<a href="ui-nav-tabs.html">Tabs</a>
										</li>
										<li>
											<a href="ui-toasts.html">Toasts</a>
										</li>
										<li>
											<a href="ui-tooltips.html">Tooltips</a>
										</li>
										<li>
											<a href="ui-typography.html">Typography</a>
										</li>
										<li>
											<a href="ui-video.html">Video</a>
										</li>
										<li>
											<a href="ui-sortable.html">Sortable</a>
										</li>
										<li>
											<a href="ui-swiperjs.html">Swiperjs</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i data-feather="layers"></i>
										<span>Advanced UI</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="ui-ribbon.html">Ribbon</a>
										</li>
										<li>
											<a href="ui-clipboard.html">Clipboard</a>
										</li>
										<li>
											<a href="ui-drag-drop.html">Drag & Drop</a>
										</li>
										<li>
											<a href="ui-rangeslider.html">Range Slider</a>
										</li>
										<li>
											<a href="ui-rating.html">Rating</a>
										</li>
										<li>
											<a href="ui-text-editor.html">Text Editor</a>
										</li>
										<li>
											<a href="ui-counter.html">Counter</a>
										</li>
										<li>
											<a href="ui-scrollbar.html">Scrollbar</a>
										</li>
										<li>
											<a href="ui-stickynote.html">Sticky Note</a>
										</li>
										<li>
											<a href="ui-timeline.html">Timeline</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-chart-infographic fs-16 me-2"></i> <span>Charts</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="chart-apex.html">Apex Charts</a>
										</li>
										<li>
											<a href="chart-c3.html">Chart C3</a>
										</li>
										<li>
											<a href="chart-js.html">Chart Js</a>
										</li>
										<li>
											<a href="chart-morris.html">Morris Charts</a>
										</li>
										<li>
											<a href="chart-flot.html">Flot Charts</a>
										</li>
										<li>
											<a href="chart-peity.html">Peity Charts</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-icons fs-16 me-2"></i> <span>Icons</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="icon-fontawesome.html">Fontawesome Icons</a>
										</li>
										<li>
											<a href="icon-feather.html">Feather Icons</a>
										</li>
										<li>
											<a href="icon-ionic.html">Ionic Icons</a>
										</li>
										<li>
											<a href="icon-material.html">Material Icons</a>
										</li>
										<li>
											<a href="icon-pe7.html">Pe7 Icons</a>
										</li>
										<li>
											<a href="icon-simpleline.html">Simpleline Icons</a>
										</li>
										<li>
											<a href="icon-themify.html">Themify Icons</a>
										</li>
										<li>
											<a href="icon-weather.html">Weather Icons</a>
										</li>
										<li>
											<a href="icon-typicon.html">Typicon Icons</a>
										</li>
										<li>
											<a href="icon-flag.html">Flag Icons</a>
										</li>
										<li>
											<a href="icon-tabler.html">Tabler Icons</a>
										</li>
										<li>
											<a href="icon-bootstrap.html">Bootstrap Icons</a>
										</li>
										<li>
											<a href="icon-remix.html">Remix Icons</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-input-search fs-16 me-2"></i>
										<span>Forms</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li className="submenu submenu-two">
											<a href="#">
												Form Elements<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="form-basic-inputs.html">Basic Inputs</a>
												</li>
												<li>
													<a href="form-checkbox-radios.html">Checkbox & Radios</a>
												</li>
												<li>
													<a href="form-input-groups.html">Input Groups</a>
												</li>
												<li>
													<a href="form-grid-gutters.html">Grid & Gutters</a>
												</li>
												<li>
													<a href="form-select.html">Form Select</a>
												</li>
												<li>
													<a href="form-mask.html">Input Masks</a>
												</li>
												<li>
													<a href="form-fileupload.html">File Uploads</a>
												</li>
											</ul>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Layouts<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="form-horizontal.html">Horizontal Form</a>
												</li>
												<li>
													<a href="form-vertical.html">Vertical Form</a>
												</li>
												<li>
													<a href="form-floating-labels.html">Floating Labels</a>
												</li>
											</ul>
										</li>
										<li>
											<a href="form-validation.html">Form Validation</a>
										</li>
										<li>
											<a href="form-select2.html">Select2</a>
										</li>
										<li>
											<a href="form-wizard.html">Form Wizard</a>
										</li>
										<li>
											<a href="form-pickers.html">Form Picker</a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-table fs-16 me-2"></i>
										<span>Tables</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="tables-basic.html">Basic Tables </a>
										</li>
										<li>
											<a href="data-tables.html">Data Table </a>
										</li>
									</ul>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-map-pin-pin fs-16 me-2"></i>
										<span>Maps</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="maps-vector.html">Vector</a>
										</li>
										<li>
											<a href="maps-leaflet.html">Leaflet</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Help</h6>
							<ul>
								<li>
									<a href="#">
										<i className="ti ti-file-text fs-16 me-2"></i>
										<span>Documentation</span>
									</a>
								</li>
								<li>
									<a href="#">
										<i className="ti ti-exchange fs-16 me-2"></i>
										<span>Changelog </span>
										<span className="badge bg-primary badge-xs text-white fs-10 ms-2">v2.1.3</span>
									</a>
								</li>
								<li className="submenu">
									<a href="#">
										<i className="ti ti-menu-2 fs-16 me-2"></i>
										<span>Multi Level</span>
										<span className="menu-arrow"></span>
									</a>
									<ul>
										<li>
											<a href="#">Level 1.1</a>
										</li>
										<li className="submenu submenu-two">
											<a href="#">
												Level 1.2<span className="menu-arrow inside-submenu"></span>
											</a>
											<ul>
												<li>
													<a href="#">Level 2.1</a>
												</li>
												<li className="submenu submenu-two submenu-three">
													<a href="#">
														Level 2.2<span className="menu-arrow inside-submenu inside-submenu-two"></span>
													</a>
													<ul>
														<li>
															<a href="#">Level 3.1</a>
														</li>
														<li>
															<a href="#">Level 3.2</a>
														</li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
