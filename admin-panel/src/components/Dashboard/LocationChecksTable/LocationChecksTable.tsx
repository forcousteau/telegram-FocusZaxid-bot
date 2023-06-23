import React, { useContext, useEffect, useState } from 'react';

import { Badge, Button, message, Table } from 'antd';
import { PlusCircleFilled, DownloadOutlined } from '@ant-design/icons';

import { ILocationCheck, LocationCheckStatus } from '../../../types/locationChecks';
import { createLocationCheck, fetchLocationChecks } from '../../../api/locationChecks';
import { apiURL } from '../../../api/api';
import AuthContext from '../../../contexts/AuthContext';

const LocationChecksTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { geolocationStartAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [locationChecks, setLocationChecks] = useState<ILocationCheck[]>();

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const locationChecks = await fetchLocationChecks();
	  setLocationChecks(locationChecks);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onCreate = async () => {
	try {
	  await createLocationCheck();
	  message.success('Перевірка успішно створена!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити перевірку');
	}
	finally {
	  updateData();
	}
  };

  const columns = [
	{
	  title: 'Дата',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	  sorter: (a, b) => (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime(),
	  sortDirections: ['descend', 'ascend'],
	  defaultSortOrder: 'descend',
	  showSorterTooltip: false,
	  render: (_, { createdAt }) => (new Date(createdAt)).toLocaleString('uk-UA', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	  })
	},
	{
	  title: 'Статус',
	  dataIndex: 'status',
	  key: 'status',
	  sorter: (a, b) => a.status - b.status,
	  sortDirections: ['descend', 'ascend'],
	  showSorterTooltip: false,
	  render: (_, { status }) => {
		let statusText, statusIndicator;

		switch (status) {
		  case LocationCheckStatus.ACTIVE:
			statusText = 'В процесі';
			statusIndicator = 'processing';
			break;
		  case LocationCheckStatus.WAITING:
			statusText = 'Очікує';
			statusIndicator = 'warning';
			break;
		  case LocationCheckStatus.FINISHED:
			statusText = 'Завершена';
			statusIndicator = 'success';
			break;
		  default:
			statusText = '?';
			statusIndicator = 'default';
		}

		return <Badge text={statusText} status={statusIndicator}/>
	  }
	},
	{
	  title: 'Звіт',
	  dataIndex: 'report',
	  key: 'report',
	  render: (_, { id, status }) => (
	    <Button
		  type="dashed"
		  disabled={status !== LocationCheckStatus.FINISHED}
		  icon={<DownloadOutlined />}
		  href={`${apiURL}/locationCheckResults/table?id=${id}`}
		/>
	  )
	}
  ];

  return (
	<div className="LocationChecksTable">
	  {
		geolocationStartAccess &&
        <div style={{ marginBottom: 16 }}>
            <Button
                type="primary"
                icon={<PlusCircleFilled/>}
                onClick={onCreate}
            >
                Створити
            </Button>
        </div>
	  }

	  <Table
		loading={loading}
		//@ts-ignore
		columns={columns}
		dataSource={locationChecks}
		rowKey="id"
		locale={{ emptyText: 'Нічого не знайдено' }}
	  />
	</div>
  );
}

export default LocationChecksTable;
