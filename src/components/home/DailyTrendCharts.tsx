'use client';

import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import type { DailyTrendDef } from '@/_interface/ReportResultDef';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
});

const PRIMARY_COLOR = '#FF9F43';
const REVENUE_COLOR = '#28C76F';
const COUNT_COLOR = '#4F46E5';

export default function DailyTrendChart({ dailyTrend }: { dailyTrend: DailyTrendDef[] }) {
	const categories = dailyTrend.map(d => d.date);
	const amounts = dailyTrend.map(d => d.total_amount);
	const revenue = dailyTrend.map(d => d.revenue);
	const counts = dailyTrend.map(d => d.transaction_count);

	const options: ApexOptions = {
		chart: {
			type: 'line',
			toolbar: { show: false },
			fontFamily: 'inherit',
		},
		stroke: {
			width: [0, 0, 3],
			curve: 'smooth',
		},
		plotOptions: {
			bar: { columnWidth: '45%', borderRadius: 4 },
		},
		xaxis: {
			categories,
			labels: {
				formatter: (val: string) =>
					new Date(val).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
					}),
			},
		},
		yaxis: [
			{
				title: { text: 'Amount' },
				labels: {
					formatter: (val: number) => val.toLocaleString(),
				},
			},
			{
				show: false, // hide duplicate axis for the second bar series
			},
			{
				opposite: true,
				title: { text: 'Transaction Count' },
				min: 0,
				forceNiceScale: true,
			},
		],
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (val: number, opts?: { seriesIndex?: number }) =>
					opts?.seriesIndex === 2 ? val.toLocaleString() : val.toLocaleString(),
			},
		},
		dataLabels: { enabled: false },
		colors: [PRIMARY_COLOR, REVENUE_COLOR, COUNT_COLOR],
		legend: { position: 'top' },
		grid: {
			borderColor: '#F1F1F2',
		},
	};

	const series: ApexAxisChartSeries = [
		{ name: 'Total Amount', type: 'column', data: amounts },
		{ name: 'Revenue (Success)', type: 'column', data: revenue },
		{ name: 'Transaction Count', type: 'line', data: counts },
	];

	return <ReactApexChart options={options} series={series} type="line" height={350} />;
}
