import Link from 'next/link';

import { getAuth } from '@/_lib/auth';
import MemberList from '@/components/add_members/MemberList';
import { all_routes as routes } from '@/components/core/data/all_routes';
import Footer from '@/components/partials/footer';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';
import TooltipIcons from '@/components/tooltip-content/tooltipIcons';

export default async function TenantMembers() {
	const auth = await getAuth();

	return (
		<div>
			<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4>Tenant Members</h4>
								<h6>Here are the list of tenant members</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<TooltipIcons />
							<RefreshIcon />
							<CollapseIcon />
						</ul>
						<div className="page-btn">
							<Link href={routes.addUserToTenant} className="btn btn-primary">
								<i className="ti ti-circle-plus me-1"></i>
								Add New Member
							</Link>
						</div>
					</div>

					<MemberList sub={auth!.sub} />
				</div>
				<Footer />
			</div>
		</div>
	);
}
