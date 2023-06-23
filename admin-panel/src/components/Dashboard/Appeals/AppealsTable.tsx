import React, { useContext, useEffect, useState } from 'react';
import { Button, message, Table, Typography } from 'antd';
import { getColumnSearchProps } from '../../../helpers/tableSearch';
import AuthContext from '../../../contexts/AuthContext';
import { IAppeal } from '../../../types/appeals';
import { deleteAppeals, fetchAppeals } from '../../../api/appeals';

const AppealsTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [appeals, setAppeals] = useState<IAppeal[]>();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const appeals = await fetchAppeals();
	  setAppeals(appeals);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onDelete = async () => {
	try {
	  await deleteAppeals(selectedRowKeys);

	  setSelectedRowKeys([]);
	  message.success('Примітки успішно видалені!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось видалити примітки');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Примітка',
	  dataIndex: 'message',
	  key: 'message',
	  ...getColumnSearchProps('message', setSearchText, setSearchedColumn)
	},
	{
	  title: 'ПІБ',
	  dataIndex: 'fullName',
	  key: 'fullName',
	  sorter: (a, b) => a.fullName.localeCompare(b.fullName),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  ...getColumnSearchProps('fullName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Номер телефону',
	  dataIndex: 'phoneNumber',
	  key: 'phoneNumber',
	  ...getColumnSearchProps('phoneNumber', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Дата створення',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	  sorter: (a, b) => new Date(b).getTime() - new Date(a).getTime(),
	  defaultSortOrder: 'descend',
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { id, createdAt }) => new Date(createdAt).toLocaleString(),
	}
  ];

  const rowSelection = {
	selectedRowKeys,
	onChange: keys => setSelectedRowKeys(keys)
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
	<div className="EmployeesTable">
	  {
		writeAccess &&
        <div style={{ marginBottom: 16 }}>
            <Button
				danger
				type="primary"
				disabled={!hasSelected}
				onClick={onDelete}
			>
                Видалити
            </Button>

            <span style={{ marginLeft: 8 }}>
			  {hasSelected && `Обрано ${selectedRowKeys.length} примітка(ок)`}
			</span>
        </div>
	  }

	  <Table
		loading={loading}
		//@ts-ignore
		columns={columns}
		//@ts-ignore
		dataSource={appeals}
		rowSelection={rowSelection}
		rowKey="id"
		locale={{
		  filterReset: 'Скинути',
		  filterConfirm: 'ОК',
		  emptyText: 'Нічого не знайдено'
		}}
	  />
	</div>
  );
}

export default AppealsTable;
