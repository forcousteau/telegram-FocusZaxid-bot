import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, message, Row, Table, Typography } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import PositionCategoryCreator from './PositionCategoryCreator';
import { getColumnSearchProps } from '../../../helpers/tableSearch';
import { IPositionCategory } from '../../../types/positionCategories';
import { editPositionCategory, fetchPositionCategories } from '../../../api/positionCategories';
import AuthContext from '../../../contexts/AuthContext';

const PositionCategoriesTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [positionCategories, setPositionCategories] = useState<IPositionCategory[]>();

  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const categories = await fetchPositionCategories();
	  setPositionCategories(categories);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onEdit = async (id: number, data: Partial<IPositionCategory>) => {
	try {
	  await editPositionCategory(id, data);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось відредагувати категорію');
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
	}
  ];

  return (
	<div className="PositionsTable">
	  <Row justify="center">
		<Col sm={24} md={12}>
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
			dataSource={positionCategories}
			rowKey="id"
			locale={{ emptyText: 'Нічого не знайдено' }}
		  />

		  {
		    writeAccess &&
			<PositionCategoryCreator
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

export default PositionCategoriesTable;
