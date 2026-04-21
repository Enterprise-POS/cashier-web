import Image from 'next/image';

import { RouteLink, all_routes as routes } from '@/components/core/data/all_routes';

export default function Error404Component({
	title,
	message,
	href,
	hrefText,
}: {
	title?: string;
	message?: string;
	href?: string;
	hrefText?: RouteLink;
}) {
	return (
		<div className="main-wrapper">
			<div className="error-box">
				<div className="error-img">
					<Image
						width={543}
						height={443}
						src="/assets/img/authentication/error-404.png"
						className="img-fluid"
						alt="image"
					/>
				</div>
				<h3 className="h2 mb-3">{title ?? 'Oops, something went wrong'}</h3>
				<p>{message ?? 'Error 404 Page not found. Sorry the page you looking for doesn’t exist or has been moved'}</p>
				<a href={href ?? routes.index} className="btn btn-primary">
					{hrefText ?? 'Back to Dashboard'}
				</a>
			</div>
		</div>
	);
}
