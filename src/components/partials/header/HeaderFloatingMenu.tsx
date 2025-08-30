'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { signOut } from '@/_lib/action';
import { all_routes as routes } from '@/components/core/data/all_routes';
import { useTenant } from '@/components/provider/TenantProvider';

export default function HeaderFloatingMenu({ name, sub }: { name: string; sub: number }) {
	const router = useRouter();
	const { refetchGetTenants } = useTenant();
	const [whileSigningOut, setWhileSigningOut] = useState(false);

	// Maintaining correct current tenant
	useEffect(() => {
		refetchGetTenants();
	}, [sub]);

	async function handleSignOut() {
		if (whileSigningOut) return;
		setWhileSigningOut(true);

		const { error } = await signOut();
		if (error !== null) {
			setWhileSigningOut(false);
			throw new Error(error);
		} else {
			router.push('/login');
			router.refresh();
		}
	}

	return (
		<>
			<div className="dropdown-menu menu-drop-user">
				<div className="profileset d-flex align-items-center">
					<span className="user-img me-2">
						<Image src="/assets/img/profiles/avator1.jpg" alt="Img" width={30} height={30} />
					</span>
					<div>
						<h6 className="fw-medium">{name}</h6>
						<p>ID: {sub}</p>
					</div>
				</div>
				<Link className="dropdown-item" href={routes.profileSettings}>
					<i className="ti ti-user-circle me-2"></i>MyProfile
				</Link>
				<Link className="dropdown-item" href={routes.salesReport}>
					<i className="ti ti-file-text me-2"></i>Reports
				</Link>
				{/* <Link className="dropdown-item" href={all_routes.}>
				<i className="ti ti-settings-2 me-2"></i>Settings
			</Link> */}
				<hr className="my-2" />
				<Link
					className="dropdown-item logout pb-0"
					href={routes.login}
					onClick={event => {
						event.preventDefault();
						handleSignOut();
					}}
				>
					<i className="ti ti-logout me-2"></i>Logout
				</Link>
			</div>
		</>
	);
}

/**
 * <Toast
			show={showPrimaryToast}
			onClose={handlePrimaryToastClose}
			id="primaryToast"
			className="colored-toast bg-primary-transparent"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
	>
			<Toast.Header closeButton className="bg-primary text-fixed-white">
					<strong className="me-auto">Toast</strong>
					<Button
							variant="close"
							onClick={handlePrimaryToastClose}
							aria-label="Close"
					/>
			</Toast.Header>
			<Toast.Body>
					Hello, world! This is a primary toast message.
			</Toast.Body>
	</Toast>
 */
