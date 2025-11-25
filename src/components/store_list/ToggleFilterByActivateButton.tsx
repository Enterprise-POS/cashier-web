'use client';
import { Tooltip } from 'antd';
import Link from 'next/link.js';
import { useSearchParams } from 'next/navigation';
import { MouseEventHandler, useState } from 'react';
import { Filter } from 'react-feather';

enum FilterByActivate {
	ACTIVE_ONLY = 'active_only',
	INACTIVE_ONLY = 'inactive_only',
	NO_FILTER = 'no_filter',
}

export default function ToggleFilterByActivateButton() {
	const searchParams = useSearchParams();
	const filters = [FilterByActivate.ACTIVE_ONLY, FilterByActivate.INACTIVE_ONLY, FilterByActivate.NO_FILTER];
	const filterByActivateParam = searchParams.get('filter_by_activate') as FilterByActivate | null;

	const [currentIndex, setIndex] = useState<number>(filters.findIndex(f => f === filterByActivateParam));

	const onClick: MouseEventHandler<HTMLAnchorElement> = function (e) {
		e.preventDefault();
		const url = new URL(window.location.href);
		const params = url.searchParams;

		// Move 1 index or if it's max then back to 0
		if (currentIndex + 1 > filters.length - 1) {
			params.set('filter_by_activate', filters[0]);
			history.pushState({}, '', url.toString());
			setIndex(0);
		} else {
			params.set('filter_by_activate', filters[currentIndex + 1]);
			history.pushState({}, '', url.toString());
			setIndex(currentIndex + 1);
		}
	};

	const filterBtnColor = { stroke: '' };
	switch (currentIndex) {
		case 0:
			filterBtnColor.stroke = 'green';
			break;
		case 1:
			filterBtnColor.stroke = 'red';
			break;
		case 2:
		default:
			filterBtnColor.stroke = '';
			break;
	}

	return (
		<li>
			<Tooltip title="Filter store">
				<Link href="#" onClick={onClick}>
					<Filter width={16} height={16} style={filterBtnColor} />
				</Link>
			</Tooltip>
		</li>
	);
}
