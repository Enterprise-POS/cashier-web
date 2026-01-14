import Image from 'next/image';
import Link from 'next/link';

import { OrderItem } from '@/_classes/OrderItem';
import { PurchasedItem } from '@/_classes/PurchasedItem';
import { OrderItemFindByIdReturnType } from '@/_lib/order_item';
import { setStringPrefix } from '@/_lib/utils';
import { all_routes as routes } from '@/components/core/data/all_routes';
import CreatedDate from '@/components/sales_report_detail/CreatedDate';

export default function SalesReportDetailComponents({ id, data }: { id: number; data: OrderItemFindByIdReturnType }) {
	// Because at the server we can't directly use new Date we make the client to calculate new Date
	const orderItem = new OrderItem(data.order_item);
	const purchasedItems = data.purchased_item_list.map(def => new PurchasedItem(def));
	const createdAt = orderItem.createdAt.getTime();

	return (
		<>
			{/* Invoices */}
			<div className="card">
				<div className="card-body">
					<div className="row justify-content-between align-items-center border-bottom mb-3">
						<div className="col-md-6">
							<div className="mb-2 invoice-logo">
								<Image src="/favicon.png" width={45} height={45} className="img-fluid logo" alt="logo" />
								{/* <img src="assets/img/logo-white.svg" width={130} className="img-fluid logo-white" alt="logo" /> */}
							</div>
							{/* <p>3099 Kennedy Court Framingham, MA 01702</p> */}
						</div>
						<div className="col-md-6">
							<div className=" text-end mb-3">
								<h5 className="text-gray mb-1">
									Report ID <span className="text-primary">#{id}</span>
								</h5>
								<CreatedDate epochTime={createdAt} />
							</div>
						</div>
					</div>
					{/* <SalesReportAddress /> */}
					<div>
						<div className="table-responsive mb-3">
							<table className="table">
								<thead className="thead-light">
									<tr>
										<th>Product Name</th>
										<th className="text-end">Qty</th>
										<th className="text-end">Price</th>
										<th className="text-end">SubTotal</th>
										<th className="text-end">Discount</th>
										<th className="text-end">Total</th>
									</tr>
								</thead>
								<tbody>
									{purchasedItems.map(purchasedItem => (
										<tr key={purchasedItem.id}>
											<td>
												<Link href={routes.editProduct.replace('<itemId>', purchasedItem.itemId.toString())}>
													<h6>{purchasedItem.itemNameSnapshot}</h6>
												</Link>
											</td>
											<td className="text-gray-9 fw-medium text-end">{purchasedItem.quantity}</td>
											<td className="text-gray-9 fw-medium text-end">
												{setStringPrefix(purchasedItem.purchasedPrice, '￥')}
											</td>
											<td className="text-gray-9 fw-medium text-end">
												{setStringPrefix(purchasedItem.purchasedPrice * purchasedItem.quantity, '￥')}
											</td>
											<td className="text-gray-9 fw-medium text-end">
												{setStringPrefix(purchasedItem.discountAmount, '￥')}
											</td>
											<td className="text-gray-9 fw-medium text-end">
												{setStringPrefix(purchasedItem.totalAmount, '￥')}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="row border-bottom mb-3">
						<div className="col-md-5 ms-auto mb-3">
							<div className="d-flex justify-content-between align-items-center border-bottom mb-2 pe-3">
								<p className="mb-0">Sub Total</p>
								<p className="text-dark fw-medium mb-2">{setStringPrefix(orderItem.subTotal, '￥')}</p>
							</div>
							<div className="d-flex justify-content-between align-items-center border-bottom mb-2 pe-3">
								<p className="mb-0">Discount (0%)</p>
								<p className="text-dark fw-medium mb-2">{setStringPrefix(orderItem.discountAmount, '￥')}</p>
							</div>
							<div className="d-flex justify-content-between align-items-center mb-2 pe-3">
								<h5>Total Amount</h5>
								<h5>{setStringPrefix(orderItem.totalAmount, '￥')}</h5>
							</div>
							<div className="d-flex justify-content-between align-items-center mb-2 pe-3 border-bottom mb-2 pe-3">
								<p className="mb-0">Paid Amount</p>
								<p className="text-dark fw-medium mb-2">{setStringPrefix(orderItem.purchasedPrice, '￥')}</p>
							</div>
							<div className="d-flex justify-content-between align-items-center mb-2 pe-3">
								<p className="mb-0">Change</p>
								<p className="text-dark fw-medium mb-2">
									{setStringPrefix(orderItem.purchasedPrice - orderItem.totalAmount, '￥')}
								</p>
							</div>
							<p className="fs-12">Amount in Words : Dollar Five thousand Seven Seventy Five</p>
						</div>
					</div>
					<div className="row align-items-center border-bottom mb-3">
						<div className="col-md-7">
							<div>
								<div className="mb-3">
									<h6 className="mb-1">Notes</h6>
									<p>Any transactions recorded here cannot be refund.</p>
								</div>
							</div>
						</div>
						<div className="col-md-5">
							<div className="text-end">{/* <img src="assets/img/sign.svg" className="img-fluid" alt="sign" /> */}</div>
							<div className="text-end mb-3">
								<h6 className="fs-14 fw-medium">Enterprise POS</h6>
								<p>Staff</p>
							</div>
						</div>
					</div>
					<div className="text-center">
						<div className="mb-3 invoice-logo d-flex align-items-center justify-content-center">
							<Image src="/favicon.png" width={60} height={60} className="img-fluid logo" alt="logo" />
							{/* <img src="assets/img/logo-white.svg" width={130} className="img-fluid logo-white" alt="logo" /> */}
						</div>
						<p className="text-dark mb-1">All payment created here is valid and cannot be edited.</p>
						<div className="d-flex justify-content-center align-items-center">
							<p className="fs-12 mb-0 me-3">
								Store ID : <span className="text-dark">{orderItem.storeId}</span>
							</p>
							<p className="fs-12">
								Tenant ID : <span className="text-dark">{orderItem.tenantId}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* /Invoices */}
			<div className="d-flex justify-content-center align-items-center mb-4">
				<Link href="#" className="btn btn-primary d-flex justify-content-center align-items-center me-2">
					<i className="ti ti-printer me-2" />
					Print Invoice
				</Link>
				<Link href="#" className="btn btn-secondary d-flex justify-content-center align-items-center border">
					<i className="ti ti-copy me-2" />
					Clone Invoice
				</Link>
			</div>
		</>
	);
}
