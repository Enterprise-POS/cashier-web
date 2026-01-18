/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd';
import { JSX, useEffect, useState } from 'react';

export type DataTableColumn = {
	title: string;
	dataIndex: string;
	sorter?: (a: any, b: any) => number;
	render?: (a: any, b: any) => JSX.Element | string;
	key?: string;
};

type DataTableParam = {
	props: string | undefined;
	columns: DataTableColumn[];
	dataSource: any[];
};

function Datatable({ props, columns, dataSource }: DataTableParam) {
	const [searchText, setSearchText] = useState('');
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
	const onSelectChange = (newSelectedRowKeys: any) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const handleSearch = (value: any) => {
		setSearchText(value);
		const filteredData = dataSource.filter((record: any) =>
			Object.values(record).some(field => String(field).toLowerCase().includes(value.toLowerCase()))
		);
		setFilteredDataSource(filteredData);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	// Maintaining the members data, when optimistic event happen this data already render it correctly
	// We can use dataSource directly but the filter / search input will not working
	useEffect(() => {
		setFilteredDataSource(dataSource);
	}, [dataSource]);

	return (
		<>
			<div className="search-set table-search-set">
				<div className="search-input">
					<a href="#" className="btn btn-searchset">
						<i className="ti ti-search fs-14 feather-search" />
					</a>
					<div id="DataTables_Table_0_filter" className="dataTables_filter">
						<label>
							{' '}
							<input
								type="search"
								onChange={e => handleSearch(e.target.value)}
								className="form-control form-control-sm"
								placeholder="Search"
								aria-controls="DataTables_Table_0"
								value={searchText}
							/>
						</label>
					</div>
				</div>
			</div>

			<Table
				key={props}
				className="table datanew dataTable no-footer"
				rowSelection={rowSelection}
				columns={columns}
				dataSource={filteredDataSource}
				rowKey={record => record.id}
				pagination={{
					locale: { items_per_page: '' },
					nextIcon: (
						<span>
							<i className="fa fa-angle-right" />
						</span>
					),
					prevIcon: (
						<span>
							<i className="fa fa-angle-left" />
						</span>
					),
					defaultPageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '30'],
				}}
			/>
		</>
	);
}

export default Datatable;
