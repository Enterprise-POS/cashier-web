import type { DatePickerProps, GetProps } from 'antd';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

import SelectVariety from '@/components/inventory/selectVariety';
import { useStore } from '@/components/provider/StoreProvider';

export default function ReportFilters() {
	const todayStart = dayjs().startOf('day');
	const todayEnd = dayjs().endOf('day');

	const storeCtx = useStore();
	const stores: { value: string; label: string }[] = storeCtx.data.storeList.map(s => ({
		value: String(s.id),
		label: s.name,
	}));

	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([todayStart, todayEnd]);
	const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
		console.log('onOk: ', value);
	};

	return (
		<div className="card border-0">
			<div className="card-body pb-1">
				<form>
					<div className="row align-items-end">
						<div className="col-lg-10">
							<div className="row">
								<div className="col-md-4">
									<div className="mb-3 d-flex flex-column">
										<label className="form-label">Choose Date&nbsp;</label>
										<div style={{ height: '38px' }}>
											<RangePicker
												value={dateRange}
												showTime={{ format: 'HH:mm' }}
												format="YYYY-MM-DD HH:mm"
												onChange={(value, _) => {
													if (value) {
														setDateRange(value as [Dayjs, Dayjs]);
													}
												}}
												onOk={onOk}
												className="h-100"
											/>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="mb-3">
										<label className="form-label">Store</label>
										<SelectVariety options={stores} />
									</div>
								</div>
								{/* <div className="col-md-4">
									<div className="mb-3">
										<label className="form-label">Products</label>
										<SelectVariety options={ProductName} />
									</div>
								</div> */}
							</div>
						</div>
						<div className="col-lg-2">
							<div className="mb-3">
								<button className="btn btn-primary w-100" type="submit">
									Generate Report
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
