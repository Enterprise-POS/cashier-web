import Link from 'next/link';

export default function CategoryDropdown() {
	return (
		<div className="dropdown me-2">
			<Link
				href="#"
				className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
				data-bs-toggle="dropdown"
			>
				Category
			</Link>
			<ul className="dropdown-menu  dropdown-menu-end p-3">
				<li>
					<Link href="#" className="dropdown-item rounded-1">
						Computers
					</Link>
				</li>
				<li>
					<Link href="#" className="dropdown-item rounded-1">
						Electronics
					</Link>
				</li>
				<li>
					<Link href="#" className="dropdown-item rounded-1">
						Shoe
					</Link>
				</li>
				<li>
					<Link href="#" className="dropdown-item rounded-1">
						Electronics
					</Link>
				</li>
			</ul>
		</div>
	);
}
