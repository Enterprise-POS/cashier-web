import { Metadata } from 'next';

import { getAuth } from '@/_lib/auth';
import AddUserToTenantForm from '@/components/form/AddUserToTenantForm';
import CollapseIcon from '@/components/tooltip-content/collapse';
import RefreshIcon from '@/components/tooltip-content/refresh';

export const metadata: Metadata = {
	title: 'Add User to Tenant',
};

export default async function Page() {
	const auth = await getAuth();
	if (auth === null) return null;

	return (
		<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="page-title">
						<h4>Add User to Tenant</h4>
						<h6>Use your new member id to add to current tenant</h6>
					</div>
					<ul className="table-top-head">
						<RefreshIcon />
						<CollapseIcon />
					</ul>
				</div>
				<AddUserToTenantForm userId={auth.sub} />
			</div>
		</div>
	);
}
