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
export class OnDismissExportError extends HomeDashboardEvent {}

export enum QuickFilterTag {
	Today = 'Today',
	LastHour = 'Last hour',
	Last6Hours = 'last 6 hours',
	Last12Hours = 'Last 12 hours',
	Last7Days = 'Last 7 days',
	ThisMonth = 'This month',
	Custom = 'Custom',
}

export class OnTagSelect extends HomeDashboardEvent {
	constructor(
		public tag: QuickFilterTag,
		public checked: boolean,
	) {
		super();
	}
}

export class OnClickDeleteInvoiceBtn extends HomeDashboardEvent {
	constructor(public orderItemId: number) {
		super();
	}
}

export class OnClickYesDeleteInvoiceBtn extends HomeDashboardEvent {
	constructor(public orderItemId: number) {
		super();
	}
}

export class OnClickRefreshBtn extends HomeDashboardEvent {}
