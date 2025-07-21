import Footer from '@/components/partials/footer';

export default function BlankPage() {
	return (
		<div className="page-wrapper pagehead d-flex flex-column justify-content-between">
			<div className="content flex-grow-1">
				<div className="page-header">
					<div className="page-title">
						<h4>Blank Page</h4>
						<h6>Sub Title</h6>
					</div>
					<ul className="table-top-head">
						<li>
							<a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh">
								<i className="ti ti-refresh"></i>
							</a>
						</li>
						<li>
							<a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header">
								<i className="ti ti-chevron-up"></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<Footer />
		</div>
	);
}
