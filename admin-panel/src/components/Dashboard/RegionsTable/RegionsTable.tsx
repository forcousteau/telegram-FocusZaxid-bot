import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, message, Table, Typography } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import RegionCreator from './RegionCreator';

import { getColumnSearchProps } from '../../../helpers/tableSearch';
import { editRegion, fetchRegions } from '../../../api/regions';
import { IRegion } from '../../../types/regions';
import AuthContext from '../../../contexts/AuthContext';

const RegionsTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<IRegion[]>();

  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const regions = await fetchRegions();
	  setRegions(regions);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onEdit = async (id: number, data: Partial<IRegion>) => {
	try {
	  await editRegion(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось відредагувати регіон');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Назва',
	  dataIndex: 'name',
	  key: 'name',
	  sorter: (a, b) => a.name.localeCompare(b.name),
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  render: (_, { id, name }) => (
		<Typography.Text editable={!writeAccess ? false : {
		  onChange: name => onEdit(id, { name })
		}}>
		  {name}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('name', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Відрядження',
	  dataIndex: 'price',
	  key: 'price',
	  sorter: (a, b) => a.price - b.price,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { id, price }) => (
		<Typography.Text editable={!writeAccess ? false : {
		  onChange: price => {
			const numMatch = price.match(/\d+/g);

			if (numMatch) {
			  return onEdit(id, { price: +numMatch[0] })
			}
		  }
		}}>
		  {`${price} грн`}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('price', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Статус',
	  dataIndex: 'status',
	  key: 'status',
	  sorter: (a, b) => +a.isActive - +b.isActive,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  filters: [
		{
		  text: 'Активні',
		  value: 'true',
		},
		{
		  text: 'Неактивні',
		  value: 'false',
		}
	  ],
	  onFilter: (value, { isActive }) => isActive.toString() === value,
	  render: (_, { isActive }) => {
		const status = isActive ? 'processing' : 'warning';
		const text = isActive ? 'Активний' : 'Неактивний';

		return <Badge status={status} text={text}/>;
	  }
	}
  ];

  if (writeAccess) {
    columns.push({
	  title: 'Дія',
	  dataIndex: 'action',
	  key: 'action',
	  responsive: ['md'],
	  // @ts-ignore
	  render: (_, { id, isActive }) => {
		const buttonText = isActive ? 'Деактивувати' : 'Активувати';
		return <a onClick={() => onEdit(id, { isActive: !isActive })}>{buttonText}</a>
	  }
	});
  }

  return (
	<div className="RegionsTable">
	  {
	    writeAccess &&
		<div style={{ marginBottom: 16 }}>
		  <Button
			type="primary"
			icon={<PlusCircleFilled/>}
			onClick={() => setCreatorVisible(true)}
		  >
			Створити
		  </Button>
		</div>
	  }

	  <Table
		loading={loading}
		//@ts-ignore
		columns={columns}
		dataSource={regions}
		rowKey="id"
		locale={{
		  filterReset: 'Скинути',
		  filterConfirm: 'ОК',
		  emptyText: 'Нічого не знайдено'
		}}
	  />

	  {
	    writeAccess &&
		<RegionCreator
		  visible={creatorVisible}
		  onCancel={() => setCreatorVisible(false)}
		  afterSubmit={updateData}
		/>
	  }
	</div>
  );
}

export default RegionsTable;
