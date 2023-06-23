import React, { useEffect, useState } from 'react';

import { Button, Col, message, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import AdminCreator from './AdminCreator';

import { deleteAdmins, editAdmin, fetchAdmins, fetchAdminsRoles } from '../../../api/admins';
import { getColumnSearchProps } from '../../../helpers/tableSearch';
import { IAdmin, IAdminsRole } from '../../../types/admins';

const AdminsTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [adminsRoles, setAdminsRoles] = useState<IAdminsRole[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  const updateData = async () => {
	setLoading(true);

	try {
	  const [admins, adminsRoles] = await Promise.all([
	    fetchAdmins(), fetchAdminsRoles()
	  ]);
	  setAdminsRoles(adminsRoles);
	  setAdmins(admins);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати адмінів');
	}
	finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
	updateData();
  }, []);

  const onEdit = async (id: string, data: Partial<IAdmin>) => {
	try {
	  await editAdmin(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось змінити адміна');
	}
	finally {
	  updateData();
	}
  };

  const onDelete = async () => {
	try {
	  await deleteAdmins(selectedRowKeys);

	  setSelectedRowKeys([]);
	  message.success('Адміни успішно видалені!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось видалити адмінів');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Логін',
	  dataIndex: 'username',
	  key: 'username',
	  sorter: (a, b) => a.username.localeCompare(b.username),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { id, username }) => (
		<Typography.Text editable={{
		  onChange: username => onEdit(id, { username })
		}}>
		  {username}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('username', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Пароль',
	  dataIndex: 'password',
	  key: 'password',
	  render: (_, { id }) => (
		<Typography.Text editable={{
		  onChange: password => onEdit(id, { password })
		}}/>
	  )
	},
	{
	  title: 'Роль',
	  dataIndex: 'role',
	  key: 'role',
	  sorter: (a, b) => a.roleName - b.roleName,
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  filters: adminsRoles?.map(role => {
	    return {
	      value: role.id,
	      text: role.name
		}
	  }),
	  onFilter: (value, { roleId }) => roleId === value,
	  render: (_, { id, roleId }) => {
		return (
		  <Select
			loading={loading}
			defaultValue={roleId}
			notFoundContent="Не удалось получить список должностей"
			onChange={(roleId) => onEdit(id, { roleId })}
			style={{
			  minWidth: 100
			}}
		  >
			{
			  adminsRoles?.map(({ id, name }) => {
				return <Select.Option key={id} value={id}>{name ?? '—'}</Select.Option>;
			  })
			}
		  </Select>
		);
	  }
	}
  ];

  const rowSelection = {
	selectedRowKeys,
	onChange: keys => setSelectedRowKeys(keys)
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
	<div className="AdminsTable">
	  <Row justify="center">
		<Col sm={24} xl={12}>
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
			  	{hasSelected && `Обрано ${selectedRowKeys.length} адмін(ів)`}
			  </span>
			</Space>
		  </div>

		  <Table
			loading={loading}
			rowSelection={rowSelection}
			//@ts-ignore
			columns={columns}
			dataSource={admins}
			rowKey="id"
			locale={{
			  filterReset: 'Скинути',
			  filterConfirm: 'ОК',
			  emptyText: 'Нічого не знайдено'
			}}
		  />

		  <AdminCreator
			visible={creatorVisible}
			onCancel={() => setCreatorVisible(false)}
			afterSubmit={updateData}
			adminsRoles={adminsRoles}
		  />
		</Col>
	  </Row>
	</div>
  );
};

export default AdminsTable;
