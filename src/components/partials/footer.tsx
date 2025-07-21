export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3 align-content-end">
			<p className="mb-0">{currentYear} &copy; Enterprise POS. All Right Reserved</p>
			<p>
				Designed &amp; Developed by{' '}
				<a href="https://github.com/AaronFabian" className="text-primary">
					Aaron Fabian Saputra
				</a>
			</p>
		</div>
	);
}
