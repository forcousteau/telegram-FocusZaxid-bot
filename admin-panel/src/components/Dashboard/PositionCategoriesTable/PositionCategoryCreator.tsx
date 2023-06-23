import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';

import { createPositionCategory, fetchPositionCategories } from '../../../api/positionCategories';
import { IPositionCategory } from '../../../types/positionCategories';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const PositionCategoryCreator: React.FC<IProps> = (props) => {
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

  const onSubmit = async ({ name }: any) => {
	try {
	  await createPositionCategory(name);
	  message.success('Категорія посад успішно створена!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити категорію посад');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення категорії посад"
	  className="PositionCategoryCreator"
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
		  label="Назва категорії"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести назву категорії!'
			}
		  ]}
		>
		  <Input placeholder="Введіть назву категорії"/>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default PositionCategoryCreator;
