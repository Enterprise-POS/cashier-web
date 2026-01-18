// Currently not being in used
export default function SalesReportAddress() {
	return (
		<div className="row border-bottom mb-3">
			<div className="col-md-5">
				<p className="text-dark mb-2 fw-semibold">From</p>
				<div>
					<h4 className="mb-1">Thomas Lawler</h4>
					<p className="mb-1">2077 Chicago Avenue Orosi, CA 93647</p>
					<p className="mb-1">
						Email : <span className="text-dark">Tarala2445@example.com</span>
					</p>
					<p>
						Phone : <span className="text-dark">+1 987 654 3210</span>
					</p>
				</div>
			</div>
			<div className="col-md-5">
				<p className="text-dark mb-2 fw-semibold">To</p>
				<div>
					<h4 className="mb-1">Carl Evans</h4>
					<p className="mb-1">3103 Trainer Avenue Peoria, IL 61602</p>
					<p className="mb-1">
						Email : <span className="text-dark">Sara_inc34@example.com</span>
					</p>
					<p>
						Phone : <span className="text-dark">+1 987 471 6589</span>
					</p>
				</div>
			</div>
			<div className="col-md-2">
				<div className="mb-3">
					<p className="text-title mb-2 fw-medium">Payment Status </p>
					<span className="bg-success text-white fs-10 px-1 rounded">
						<i className="ti ti-point-filled " />
						Paid
					</span>
					<div className="mt-3">
						<img src="assets/img/qr.svg" className="img-fluid" alt="QR" />
					</div>
				</div>
			</div>
		</div>
	);
}
