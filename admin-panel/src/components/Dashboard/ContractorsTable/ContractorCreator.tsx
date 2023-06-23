import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';

import { createPositionCategory, fetchPositionCategories } from '../../../api/positionCategories';
import { IPositionCategory } from '../../../types/positionCategories';
import { createContractor } from '../../../api/contractors';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const ContractorCreator: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ fullName }: any) => {
	try {
	  await createContractor(fullName);
	  message.success('Виконроба успішно створено!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити виконроба');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення виконроба"
	  className="ContractorCreator"
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
		labelCol={{ span: 3 }}
		labelAlign="left"
	  >
		<Form.Item
		  name="fullName"
		  label="Ім'я"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести ім\'я виконроба!'
			}
		  ]}
		>
		  <Input placeholder="Введіть ім'я виконроба"/>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default ContractorCreator;
