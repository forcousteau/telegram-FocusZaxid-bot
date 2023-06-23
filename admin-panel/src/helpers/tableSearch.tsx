import { SearchOutlined } from '@ant-design/icons/lib';
import { Button, Input, Space } from 'antd';
import React from 'react';

export const getColumnSearchProps = (dataIndex, setSearchText, setSearchedColumn) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
	<div style={{ padding: 8 }}>
	  <Input
		placeholder="Поиск..."
		value={selectedKeys[0]}
		onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
		onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
		style={{ width: 188, marginBottom: 8, display: 'block' }}
	  />
	  <Space>
		<Button onClick={() => onReset(clearFilters, setSearchText)} size="small" style={{ width: 90 }}>
		  Скинути
		</Button>
		<Button
		  type="primary"
		  onClick={() => onSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
		  icon={<SearchOutlined/>}
		  size="small"
		  style={{ width: 90 }}
		>
		  Знайти
		</Button>
	  </Space>
	</div>
  ),
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }}/>,
  onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
});

const onSearch = (selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const onReset = (clearFilters, setSearchText) => {
  clearFilters();
  setSearchText('');
};
