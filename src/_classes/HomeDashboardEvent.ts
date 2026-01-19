import { DatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/index';
import dayjs from 'dayjs';

export abstract class HomeDashboardEvent {}

export class OnClickGenerateReport extends HomeDashboardEvent {}
export class OnChangeSelectedStore extends HomeDashboardEvent {
	constructor(public storeId: string) {
		super();
	}
}
export class GetSalesReport extends HomeDashboardEvent {
	constructor(
		public page: number,
		public limit: number,
	) {
		super();
	}
}
export class OnSetDateRange extends HomeDashboardEvent {
	constructor(
		public value: [dayjs.Dayjs | null, dayjs.Dayjs | null],
		public dateString: [string, string],
	) {
		super();
	}
}
export class OnDateRangeOk extends HomeDashboardEvent {
	constructor(public value: DatePickerProps['value'] | RangePickerProps['value']) {
		super();
	}
}
export class OnClickErrorToastCloseButton extends HomeDashboardEvent {}
