'use client';
{
	/* eslint-disable-next-line @next/next/no-img-element */
}
import { Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const TooltipIcons = () => {
	return (
		<>
			<li>
				<Tooltip title="Pdf">
					<Link href="#">
						<Image src="/assets/img/icons/pdf.svg" alt="img" width={10} height={10} />
					</Link>
				</Tooltip>
			</li>
			<li>
				<Tooltip title="Excel">
					<Link href="#">
						<Image src="/assets/img/icons/excel.svg" alt="img" width={20} height={20} />
					</Link>
				</Tooltip>
			</li>
		</>
	);
};

export default TooltipIcons;
