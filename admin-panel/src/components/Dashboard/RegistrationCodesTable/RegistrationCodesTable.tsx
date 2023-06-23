import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, message, Row, Space, Table } from 'antd';
import { PlusCircleFilled, DeleteOutlined } from '@ant-design/icons';

import { getColumnSearchProps } from '../../../helpers/tableSearch';
import RegistrationCodesCreator from './RegistrationCodesCreator';
import { deleteRegistrationCodes, fetchRegistrationCodes } from '../../../api/registrationCodes';
import { IRegistrationCode } from '../../../types/registrationCodes';
import AuthContext from '../../../contexts/AuthContext';

const RegistrationCodesTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [registrationCodes, setRegistrationCodes] = useState<IRegistrationCode[]>();

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
	  const registrationCodes = await fetchRegistrationCodes();
	  setRegistrationCodes(registrationCodes);
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
	  await deleteRegistrationCodes(selectedRowKeys);

	  setSelectedRowKeys([]);
	  message.success('Коди успішно видалені!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось видалити коди');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Код',
	  dataIndex: 'code',
	  key: 'code',
	  sorter: (a, b) => a.code.localeCompare(b.code),
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'ascend',
	  showSorterTooltip: false,
	  ...getColumnSearchProps('code', setSearchText, setSearchedColumn)
	}
  ];

  const rowSelection = {
	selectedRowKeys,
	onChange: keys => setSelectedRowKeys(keys)
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
	<div className="PositionsTable">
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
					  {hasSelected && `Обрано ${selectedRowKeys.length} код(ів)`}
					</span>
                </Space>
            </div>
		  }

		  <Table
			loading={loading}
			rowSelection={rowSelection}
			//@ts-ignore
			columns={columns}
			dataSource={registrationCodes}
			rowKey="code"
			locale={{ emptyText: 'Нічого не знайдено' }}
		  />

		  <RegistrationCodesCreator
			visible={creatorVisible}
			onCancel={() => setCreatorVisible(false)}
			afterSubmit={updateData}
		  />
		</Col>
	  </Row>
	</div>
  );
}

export default RegistrationCodesTable;
