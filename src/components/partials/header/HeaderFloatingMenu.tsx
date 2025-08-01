'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signOut } from '@/_lib/action';
import { all_routes as routes } from '@/components/core/data/all_routes';

export default function HeaderFloatingMenu({ name }: { name: string }) {
	const router = useRouter();
	const [whileSigningOut, setWhileSigningOut] = useState(false);

	async function handleSignOut() {
		if (whileSigningOut) return;
		setWhileSigningOut(true);

		const { result, error } = await signOut();
		if (error !== null) {
			setWhileSigningOut(false);
			throw new Error(error);
		} else {
			router.push('/login');
			router.refresh();
		}
	}

	return (
		<div className="dropdown-menu menu-drop-user">
			<div className="profileset d-flex align-items-center">
				<span className="user-img me-2">
					<Image src="/assets/img/profiles/avator1.jpg" alt="Img" width={30} height={30} />
				</span>
				<div>
					<h6 className="fw-medium">{name}</h6>
					<p>Admin</p>
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
	);
}
