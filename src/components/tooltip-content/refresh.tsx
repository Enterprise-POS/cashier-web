'use client';
import React from 'react';

import { Tooltip } from 'antd';
import Link from 'next/link';
const RefreshIcon = () => {
	return (
		<li>
			<Tooltip title="Refresh">
				<Link href="#">
					<i className="ti ti-refresh"></i>
				</Link>
			</Tooltip>
		</li>
	);
};

export default RefreshIcon;
