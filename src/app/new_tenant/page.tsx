import { Metadata } from 'next';

import { getAuth } from '@/_lib/auth';
import NewTenantForm from '@/components/form/NewTenantForm';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export const metadata: Metadata = {
	title: 'New Tenant',
};

export default async function Page() {
	const auth = await getAuth();
	if (auth === null) return null;

	return (
		<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="page-title">
						<h4>New Tenant</h4>
						<h6>By creating new tenant you are the owner for new tenant</h6>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>
				<NewTenantForm userId={auth.sub} userName={auth.name} />
			</div>
		</div>
	);
}
