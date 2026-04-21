import { all_routes as routes } from '@/components/core/data/all_routes';
import Error404Component from '@/components/partials/Error404Component';

export default function NotFound() {
	return (
		<Error404Component
			title="404 Not Found"
			message="Could not find the requested item"
			href={routes.productList}
			hrefText="Go back to product list"
		/>
	);
}
