import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export default async function BlankPage({ name }: { name: string }) {
	return (
		<div className="page-wrapper pagehead d-flex flex-column justify-content-between">
			<div className="content flex-grow-1">
				<div className="page-header">
					<div className="page-title">
						<h4>Welcome {name}</h4>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>
			</div>
			<Footer />
		</div>
	);
}

/**
 * This component causing error
 * 
 * <ul className="table-top-head">
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
 */
