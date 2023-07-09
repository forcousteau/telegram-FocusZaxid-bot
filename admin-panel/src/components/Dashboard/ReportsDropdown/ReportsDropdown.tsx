import React, { useState } from 'react';
import { Dropdown, Form, InputNumber, Menu, Modal, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { apiURL } from '../../../api/api';
import { getMonthName } from '../../../helpers/functions';

const months = Array.from({ length: 12 }, (v, k) => k);

const ReportsDropdown: React.FC = () => {
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [reportType, setReportType] = useState('byDays');

  const onItemClicked = reportType => {
    setReportType(reportType);
    setModalVisible(true);
  };

  const onSubmit = ({ month, year }) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = `${apiURL}/reports/${reportType}?month=${month}&year=${year}`;
    a.click();
    document.body.removeChild(a);

    setModalVisible(false);
  };

  const reports = [
	{
	  type: 'byDays',
	  title: 'По днях'
	},
	{
	  type: 'byObjects',
	  title: 'По об\'єктах'
	},
	{
		type: 'byCars',
		title: 'По автомобілях'
	},
	{
	  type: 'byContractors',
	  title: 'По виконробах'
	},
	{
	  type: 'byEmployees',
	  title: 'По працівниках'
	},
	{
	  type: 'workShiftsActions',
	  title: 'По змінах'
	},
	{
	  type: 'appeals',
	  title: 'Примітки'
	},
  {
	  type: 'clothing',
	  title: 'Одяг',
    onClick: () => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = `${apiURL}/reports/clothing`;
      a.click();
      document.body.removeChild(a);
    },
	}
  ];

  const dropdownElements = (
	<Menu>
	  {
	    reports.map(({ type, title, onClick }, i) => (
        <Menu.Item key={i}>
        <span onClick={onClick || (() => onItemClicked(type))}>
          {title}
        </span>
        </Menu.Item>
		  ))
	  }
	</Menu>
  );

  const now = new Date();

  return (
	<div className="ReportsDropdown">
	  <Dropdown overlay={dropdownElements}>
		<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
		  Звіти <DownOutlined/>
		</a>
	  </Dropdown>

	  <Modal
		title="Оберіть місяць та рік"
		okText="Вигрузити звіт"
		cancelText="Відмінити"
		destroyOnClose={true}
		onOk={form.submit}
		visible={modalVisible}
		onCancel={() => setModalVisible(false)}
	  >
		<Form
		  form={form}
		  onFinish={onSubmit as any}
		  labelCol={{ span: 7 }}
		  labelAlign="left"
		  initialValues={{
		    month: now.getMonth(),
			year: now.getFullYear()
		  }}
		>
		  <Form.Item
			name="month"
			label="Місяць"
			rules={[
			  {
				required: true,
				message: 'Необхідно обрати місяць!'
			  }
			]}
		  >
			<Select placeholder="Оберіть місяць">
			  {
				months.map(month => (
				  <Select.Option value={month} key={month}>
					{getMonthName(month)}
				  </Select.Option>
				))
			  }
			</Select>
		  </Form.Item>

		  <Form.Item
			name="year"
			label="Рік"
			rules={[
			  {
				required: true,
				message: 'Необхідно ввести рік!'
			  }
			]}
		  >
			<InputNumber placeholder="Введіть рік" style={{ width: 120 }} min={2019}/>
		  </Form.Item>
		</Form>
	  </Modal>
	</div>
  );
}

export default ReportsDropdown;
