'use client;';

import Image from 'next/image';
import Link from 'next/link';

import { all_routes as routes } from '@/components/core/data/all_routes';
import { useTenant } from '@/components/provider/TenantProvider';
import { Tenant } from '@/_classes/Tenant';

export default function TenantFloatingMenu() {
	const { data, isStateLoading, setCurrentTenant } = useTenant();

	// Get the selected Tenant data
	const selectedTenant: Tenant | undefined = data.tenantList.find(tenant => tenant.id === data.selectedTenantId);

	return (
		<li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
			{!isStateLoading && selectedTenant ? (
				<a href="#" className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown" key={selectedTenant.id}>
					<span className="user-info">
						<span className="user-letter">
							<Image
								src="/assets/img/store/store-01.png"
								alt={`${selectedTenant.name} image`}
								className="img-fluid"
								width={30}
								height={30}
							/>
						</span>
						<span className="user-detail">
							<span className="user-name">{selectedTenant.name}</span>
						</span>
					</span>
				</a>
			) : (
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
							<span className="user-name">No Tenant</span>
						</span>
					</span>
				</a>
			)}
			<div className="dropdown-menu dropdown-menu-right">
				{!isStateLoading &&
					data.tenantList.map(tenant => (
						// setCurrentTenant by closure it using tenant.id
						<Link href="#" className="dropdown-item" key={tenant.id} onClick={() => setCurrentTenant(tenant.id)}>
							<Image
								src="/assets/img/store/store-01.png"
								alt="Store Logo"
								className="img-fluid"
								width={30}
								height={30}
							/>
							{tenant.name}
						</Link>
					))}
				<Link href={routes.newTenant} className="dropdown-item">
					<i className="ti ti-circle-plus me-1"></i>
					New Tenant
				</Link>
			</div>
		</li>
	);
}
