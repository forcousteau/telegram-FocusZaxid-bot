import React from 'react';
import { Form, Input, InputNumber, message, Modal } from 'antd';

import { createRegion } from '../../../api/regions';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const RegionCreator: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ name, price }: any) => {
	try {
	  await createRegion(name, price);
	  message.success('Регіон успішно створено!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити регіон');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення регіону"
	  className="RegionCreator"
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
		  label="Назва регіону"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести назву регіону!'
			}
		  ]}
		>
		  <Input placeholder="Введіть назву регіону"/>
		</Form.Item>

		<Form.Item
		  name="price"
		  label="Відрядження (грн)"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести ставку регіону!'
			}
		  ]}
		>
		  <InputNumber
			min={1}
			placeholder="Відрядження"
		  />
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default RegionCreator;
