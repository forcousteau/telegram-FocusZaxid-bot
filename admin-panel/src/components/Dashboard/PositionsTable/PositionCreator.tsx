import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';

import { fetchPositionCategories } from '../../../api/positionCategories';
import { IPositionCategory } from '../../../types/positionCategories';
import { createPosition } from '../../../api/positions';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const PositionCreator: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IPositionCategory[]>();

  const [form] = Form.useForm();

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
	setLoading(true);

	try {
	  const categories = await fetchPositionCategories();
	  setCategories(categories);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
	finally {
	  setLoading(false);
	}
  };

  const onSubmit = async ({ positionCategoryId, name, price }: any) => {
	try {
	  await createPosition(positionCategoryId, { name, price });
	  message.success('Посада успішно створена!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити посаду');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення посади"
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
		  name="name"
		  label="Назва посади"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести назву посади!'
			}
		  ]}
		>
		  <Input placeholder="Введіть назву посади"/>
		</Form.Item>

		<Form.Item
		  name="positionCategoryId"
		  label="Категорія"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно обрати категорію посади!'
			}
		  ]}
		>
		  <Select
			placeholder="Оберіть категорію посади"
			loading={loading}
			notFoundContent="Не вдалося отримати категорії"
		  >
			{
			  categories?.map(({ id, name }) => {
				return <Select.Option key={id} value={id}>{name}</Select.Option>
			  })
			}
		  </Select>
		</Form.Item>

		<Form.Item
		  name="price"
		  label="Ставка (грн/год.)"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести ставку посади!'
			}
		  ]}
		>
		  <InputNumber
			min={1}
			placeholder="Ставка"
		  />
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default PositionCreator;
