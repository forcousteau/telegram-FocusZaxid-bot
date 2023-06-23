import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';

import { fetchPositionCategories } from '../../../api/positionCategories';
import { IPositionCategory } from '../../../types/positionCategories';
import { createPosition } from '../../../api/positions';
import { IRegion } from '../../../types/regions';
import { fetchRegions } from '../../../api/regions';
import { createObject } from '../../../api/objects';
import { IContractor } from '../../../types/contractors';
import { fetchContractors } from '../../../api/contractors';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const ObjectCreator: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<IRegion[]>();
  const [contractors, setContractors] = useState<IContractor[]>();

  const [form] = Form.useForm();

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const [regions, contractors] = await Promise.all([fetchRegions(), fetchContractors()]);
	  setRegions(regions);
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

  const onSubmit = async ({ regionId, city, address, contractorId }: any) => {
	try {
	  await createObject(regionId, city, address ?? '', contractorId);
	  message.success('Об\'єкт успішно створено!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити об\'єкт');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення об'єкту"
	  className="PositionCreator"
	  okText="Створити"
	  cancelText="Відмінити"
	  destroyOnClose={true}
	  visible={props.visible}
	  onOk={form.submit}
	  onCancel={props.onCancel}
	>
	  <Form
		form={form}
		onFinish={onSubmit}
		labelCol={{ span: 7 }}
		labelAlign="left"
	  >
		<Form.Item
		  name="city"
		  label="Назва міста"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести назву міста!'
			}
		  ]}
		>
		  <Input placeholder="Введіть назву міста"/>
		</Form.Item>

		<Form.Item
		  name="address"
		  label="Адреса"
		>
		  <Input placeholder="Введіть адресу"/>
		</Form.Item>

		<Form.Item
		  name="regionId"
		  label="Регіон"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно обрати регіон об\'єкту!'
			}
		  ]}
		>
		  <Select
			placeholder="Оберіть регіон об'єкту"
			loading={loading}
			notFoundContent="Не вдалося отримати регіони"
		  >
			{
			  regions?.map(({ id, name }) => {
				return <Select.Option key={id} value={id}>{name}</Select.Option>
			  })
			}
		  </Select>
		</Form.Item>

		<Form.Item
		  name="contractorId"
		  label="Виконроб"
		  initialValue="Не задано"
		>
		  <Select
			placeholder="Оберіть виконроба об'єкту"
			loading={loading}
			notFoundContent="Не вдалося отримати виконробів"
		  >
			{
			  // @ts-ignore
			  <Select.Option key={'null'} value={null}>Не задано</Select.Option>
			}
			{
			  contractors?.map(({ id, fullName }) => {
				return <Select.Option key={id} value={id}>{fullName}</Select.Option>
			  })
			}
		  </Select>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default ObjectCreator;
