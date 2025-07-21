export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3 align-content-end">
			<p className="mb-0">{currentYear} &copy; Enterprise POS. All Right Reserved</p>
			<p>
				Designed &amp; Developed by{' '}
				<a href="javascript:void(0);" className="text-primary">
					Aaron Fabian
				</a>
			</p>
		</div>
	);
}
