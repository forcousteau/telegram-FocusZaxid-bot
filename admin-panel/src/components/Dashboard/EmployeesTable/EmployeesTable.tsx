import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Checkbox, message, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import { deleteEmployees, editEmployee, fetchEmployees } from '../../../api/employees';
import { ClothingSize, IEmployee } from '../../../types/employees';
import { getColumnSearchProps } from '../../../helpers/tableSearch';
import { IPosition } from '../../../types/positions';
import { fetchPositions } from '../../../api/positions';
import Loading from '../../Loading';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import ItemEditor from './EmployeePhotoEditor';
import AuthContext from '../../../contexts/AuthContext';
import config from '../../../config';
import { buildServerPath } from '../../../helpers/functions';

const EmployeesTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [positions, setPositions] = useState<IPosition[]>();

  const [editingId, setEditingId] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const [employees, positions] = await Promise.all([fetchEmployees(), fetchPositions()]);
	  setEmployees(employees);
	  setPositions(positions);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onEdit = async (id: number, data: Partial<IEmployee>) => {
	try {
	  await editEmployee(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось відредагувати працівника');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Звільнений',
	  dataIndex: 'isFired',
	  key: 'isFired',
	  render: (_, { id, isFired }) => (
		<Checkbox
		  defaultChecked={!!isFired}
		  disabled={!writeAccess}
		  onChange={e => onEdit(id, { isFired: e.target.checked })}
		/>
	  )
	},
	{
	  title: 'Фото',
	  dataIndex: 'photo',
	  key: 'photo',
	  render: (_, { id, photoName }) => (
		<a href="#" onClick={() => {
		  if (!writeAccess) { return; }

		  setEditingId(id);
		  setEditorVisible(true);
		}}>
		  {
		    photoName
			  ? <img src={`${buildServerPath()}/img/${photoName}`} alt="" width={100}/>
			  : <Avatar size={64} icon={<UserOutlined />} />
		  }
		</a>
	  )
	},
	{
	  title: 'ПІБ',
	  dataIndex: 'fullName',
	  key: 'fullName',
	  sorter: (a, b) => a.fullName.localeCompare(b.fullName),
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { id, fullName }) => (
		<Typography.Text editable={!writeAccess ? false : {
		  onChange: fullName => onEdit(id, { fullName })
		}}>
		  {fullName}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('fullName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Номер телефону',
	  dataIndex: 'phoneNumber',
	  key: 'phoneNumber',
	  render: (_, { id, phoneNumber }) => (
		<Typography.Text editable={!writeAccess ? false : {
		  onChange: phoneNumber => phoneNumber.length && onEdit(id, { phoneNumber })
		}}>
		  {phoneNumber}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('phoneNumber', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Посада',
	  dataIndex: 'positionName',
	  key: 'positionName',
	  sorter: (a, b) => a.positionName.localeCompare(b.positionName),
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  render: (_, { id, positionName }) => {
		if (loading) return <Loading/>

		if (writeAccess) {
		  return (
			<Select
			  loading={loading}
			  defaultValue={positions?.find(p => p.name === positionName)?.id}
			  notFoundContent="Не вдалося отримати посади"
			  onChange={(positionId) => onEdit(id, { positionId })}
			>
			  {
				positions?.map(({ id, name }) => {
				  return <Select.Option key={id} value={id}>{name}</Select.Option>
				})
			  }
			</Select>
		  )
		}
		else {
		  return positions?.find(p => p.name === positionName)?.name;
		}
	  },
	  ...getColumnSearchProps('positionName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Ставка',
	  dataIndex: 'price',
	  key: 'price',
	  sorter: (a, b) => a.price - b.price,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { price }) => `${price} грн/год.`
	},
	{
	  title: 'День народження',
	  dataIndex: 'birthDate',
	  key: 'birthDate',
	  responsive: ['lg'],
	  render: (_, { birthDate }) => new Date(birthDate).toLocaleDateString()
	},
	{
	  title: 'Розмір одягу',
	  dataIndex: 'clothingSizeName',
	  key: 'clothingSizeName',
	  responsive: ['lg'],
	  filters: [
		{
		  text: 'S',
		  value: 'S'
		},
		{
		  text: 'M',
		  value: 'M'
		},
		{
		  text: 'L',
		  value: 'L'
		},
		{
		  text: 'XL',
		  value: 'XL'
		},
		{
		  text: 'XXL',
		  value: 'XXL'
		}
	  ],
	  onFilter: (value, { clothingSizeName }) => clothingSizeName === value,
	  render: (_, { id, clothingSizeName }) => {
		let color;

		switch (clothingSizeName) {
		  case ClothingSize.S:
			color = 'green';
			break;
		  case ClothingSize.M:
			color = 'geekblue';
			break;
		  case ClothingSize.L:
			color = 'purple';
			break;
		  case ClothingSize.XL:
			color = 'gold';
			break;
		  case ClothingSize.XXL:
			color = 'orange';
			break;
		  default:
			color = 'blue';
		}

		return (
		  <Tag color={color} key={id}>
			{clothingSizeName}
		  </Tag>
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
	<div className="EmployeesTable">
	  <Table
		loading={loading}
		//@ts-ignore
		columns={columns}
		//@ts-ignore
		dataSource={employees}
		// rowSelection={rowSelection}
		rowKey="id"
		locale={{
		  filterReset: 'Скинути',
		  filterConfirm: 'ОК',
		  emptyText: 'Нічого не знайдено'
		}}
	  />

	  <ItemEditor
		visible={editorVisible}
		onCancel={() => setEditorVisible(false)}
		afterSubmit={updateData}
		id={editingId ?? 0}
	  />
	</div>
  );
}

export default EmployeesTable;
