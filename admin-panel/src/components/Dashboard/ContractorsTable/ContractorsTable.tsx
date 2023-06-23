import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, message, Row, Space, Table, Typography } from 'antd';
import { PlusCircleFilled, DeleteOutlined } from '@ant-design/icons';

import { getColumnSearchProps } from '../../../helpers/tableSearch';
import ContractorCreator from './ContractorCreator';
import { deleteContractors, editContractor, fetchContractors } from '../../../api/contractors';
import { IContractor } from '../../../types/contractors';
import AuthContext from '../../../contexts/AuthContext';

const ContractorsTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState<IContractor[]>();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const contractors = await fetchContractors();
	  setContractors(contractors);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onEdit = async (id: number, data: Partial<IContractor>) => {
	try {
	  await editContractor(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось відредагувати виконроба');
	}
	finally {
	  updateData();
	}
  };

  const onDelete = async () => {
	try {
	  await deleteContractors(selectedRowKeys);

	  setSelectedRowKeys([]);
	  message.success('Виконроби успішно видалені!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось видалити виконробів');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Ім\'я',
	  dataIndex: 'fullName',
	  key: 'fullName',
	  sorter: (a, b) => a.fullName.localeCompare(b.fullName),
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  render: (_, { id, fullName }) => (
		<Typography.Text editable={!writeAccess ? false : {
		  onChange: fullName => onEdit(id, { fullName })
		}}>
		  {fullName}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('fullName', setSearchText, setSearchedColumn)
	}
  ];

  const rowSelection = {
	selectedRowKeys,
	onChange: keys => setSelectedRowKeys(keys)
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
	<div className="ContractorsTable">
	  <Row justify="center">
		<Col sm={24} md={12}>
		  {
		    writeAccess &&
			<div style={{ marginBottom: 16 }}>
			  <Space size="small">
				<Button
				  type="primary"
				  icon={<PlusCircleFilled/>}
				  onClick={() => setCreatorVisible(true)}
				  disabled={hasSelected}
				>
				  Створити
				</Button>

				<Button
				  danger
				  type="primary"
				  onClick={onDelete}
				  disabled={!hasSelected}
				  icon={<DeleteOutlined/>}
				>
				  Видалити
				</Button>

				<span style={{ marginLeft: 8 }}>
			  	{hasSelected && `Обрано ${selectedRowKeys.length} виконроб(ів)`}
			  </span>
			  </Space>
			</div>
		  }

		  <Table
			loading={loading}
			rowSelection={rowSelection}
			//@ts-ignore
			columns={columns}
			dataSource={contractors}
			rowKey="id"
			locale={{
			  filterReset: 'Скинути',
			  filterConfirm: 'ОК',
			  emptyText: 'Нічого не знайдено'
			}}
		  />

		  {
		    writeAccess &&
			<ContractorCreator
			  visible={creatorVisible}
			  onCancel={() => setCreatorVisible(false)}
			  afterSubmit={updateData}
			/>
		  }
		</Col>
	  </Row>
	</div>
  );
}

export default ContractorsTable;
