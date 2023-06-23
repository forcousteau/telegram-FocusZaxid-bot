import React, { useContext, useEffect, useState } from 'react';
import { Button, message, Table, Typography } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import { editPosition, fetchPositions } from '../../../api/positions';
import { IPosition } from '../../../types/positions';
import { getColumnSearchProps } from '../../../helpers/tableSearch';
import PositionCreator from './PositionCreator';
import AuthContext from '../../../contexts/AuthContext';

const PositionsTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<IPosition[]>();

  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const positions = await fetchPositions();
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

  const onEdit = async (id: number, data: Partial<IPosition>) => {
	try {
	  await editPosition(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось відредагувати посаду');
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
	  title: 'Категорія',
	  dataIndex: 'positionCategoryName',
	  key: 'positionCategoryName',
	  sorter: (a, b) => {
		if (a.positionCategoryName === b.positionCategoryName) {
		  return a.name.localeCompare(b.name);
		}
		return a.positionCategoryName.localeCompare(b.positionCategoryName);
	  },
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  ...getColumnSearchProps('positionCategoryName', setSearchText, setSearchedColumn)
	},
	{
	  title: 'Ставка',
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
		  {`${price} грн/год.`}
		</Typography.Text>
	  ),
	  ...getColumnSearchProps('price', setSearchText, setSearchedColumn)
	}
  ];

  return (
	<div className="PositionsTable">
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
		dataSource={positions}
		rowKey="id"
		locale={{ emptyText: 'Нічого не знайдено' }}
	  />

	  {
	    writeAccess &&
		<PositionCreator
		  visible={creatorVisible}
		  onCancel={() => setCreatorVisible(false)}
		  afterSubmit={updateData}
		/>
	  }
	</div>
  );
}

export default PositionsTable;
