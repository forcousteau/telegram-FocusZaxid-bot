import React, { useContext, useEffect, useState } from 'react';
import { message, Table } from 'antd';
import AuthContext from '../../../contexts/AuthContext';
import { fetchWorkingHoursChanges } from '../../../api/workingHoursChanges';
import { IWorkingHoursChanges } from '../../../types/workingHoursChanges';
import { getColumnSearchProps } from '../../../helpers/tableSearch';

const WorkingHoursChangesTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [workingHoursChanges, setWorkingHoursChanges] = useState<IWorkingHoursChanges[]>();

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const workingHoursChanges = await fetchWorkingHoursChanges();
	  setWorkingHoursChanges(workingHoursChanges);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const columns = [
	{
	  title: 'Дата',
	  dataIndex: 'date',
	  key: 'date',
	  sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (date) => new Date(date).toLocaleDateString()
	},
	{
	  title: 'Ім\'я робітника',
	  dataIndex: 'fullName',
	  key: 'fullName',
	  sorter: (a, b) => a.fullName.localeCompare(b.fullName),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  ...getColumnSearchProps('fullName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Об\'єкт',
	  dataIndex: 'objectName',
	  key: 'objectName',
	  sorter: (a, b) => a.objectName.localeCompare(b.objectName),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  ...getColumnSearchProps('objectName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Годин до зміни',
	  dataIndex: 'workingHoursBefore',
	  key: 'workingHoursBefore',
	  sorter: (a, b) => a.workingHoursBefore - b.workingHoursBefore,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (workingHoursBefore) => workingHoursBefore.toString().concat(' год.'),
	  ...getColumnSearchProps('workingHoursBefore', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Годин після зміни',
	  dataIndex: 'workingHoursAfter',
	  key: 'workingHoursAfter',
	  sorter: (a, b) => a.workingHoursAfter - b.workingHoursAfter,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (workingHoursAfter) => workingHoursAfter.toString().concat(' год.'),
	  ...getColumnSearchProps('workingHoursAfter', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Дата зміни',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  defaultSortOrder: 'descend',
	  render: (createdAt) => new Date(createdAt).toLocaleDateString()
	}
  ];

  return (
	<Table
	  loading={loading}
	  //@ts-ignore
	  columns={columns}
	  dataSource={workingHoursChanges}
	  rowKey="id"
	  locale={{
		filterReset: 'Скинути',
		filterConfirm: 'ОК',
		emptyText: 'Нічого не знайдено'
	  }}
	/>
  );
}

export default WorkingHoursChangesTable;
