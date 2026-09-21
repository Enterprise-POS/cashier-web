'use client';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'antd';
import { QueryKey } from '@tanstack/react-query';

type RefreshIconProps = {
	queryKey: QueryKey; // e.g. ['productList'] or ['productList', tenantId]
};

const RefreshIcon = ({ queryKey }: RefreshIconProps) => {
	const queryClient = useQueryClient();
	const isFetching = useIsFetching({ queryKey }) > 0;

	const handleRefresh = (e: React.MouseEvent) => {
		e.preventDefault();
		queryClient.invalidateQueries({ queryKey });
	};

	return (
		<li>
			<Tooltip title="Refresh">
				<a href="#" onClick={handleRefresh}>
					<i className={`ti ${isFetching ? 'ti-clock' : 'ti-refresh'}`} />
				</a>
			</Tooltip>
		</li>
	);
};

export default RefreshIcon;
