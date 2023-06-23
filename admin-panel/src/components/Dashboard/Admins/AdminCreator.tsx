import React from 'react';

import { Form, Input, message, Modal, Select } from 'antd';

import { createAdmin } from '../../../api/admins';
import { IAdminsRole } from '../../../types/admins';

interface ICreatorProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
  adminsRoles: IAdminsRole[];
}

const AdminCreator: React.FC<ICreatorProps> = (props) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ username, password, roleId }: any) => {
	try {
	  await createAdmin({ username, password, roleId });
	  message.success('Адмін успішно створений!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити адміна');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення адміна"
	  className="AdminCreator"
	  okText="Створити"
	  cancelText="Відмінити"
	  destroyOnClose={true}
	  visible={props.visible}
	  onOk={form.submit}
	  onCancel={props.onCancel}
	>
	  <Form
		form={form}
		initialValues={{ remember: false }}
		onFinish={onSubmit}
		labelCol={{ span: 5 }}
		labelAlign="left"
	  >
		<Form.Item
		  name="username"
		  label="Логін"
		  rules={[
			{
			  required: true,
			  message: 'Введіть логін адміна!'
			}
		  ]}
		>
		  <Input placeholder="Введіть логін адміна"/>
		</Form.Item>

		<Form.Item
		  name="password"
		  label="Пароль"
		  rules={[
			{
			  required: true,
			  message: 'Введіть пароль адміна!'
			}
		  ]}
		>
		  <Input type="password" placeholder="Введіть пароль адміна"/>
		</Form.Item>

		<Form.Item
		  name="roleId"
		  label="Роль"
		  initialValue={props.adminsRoles[0]?.id}
		  rules={[
			{
			  required: true,
			  message: 'Оберіть роль!'
			}
		  ]}
		>
		  <Select placeholder="Оберіть роль">
			{
			  props.adminsRoles.map(role => (
				<Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
			  ))
			}
		  </Select>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default AdminCreator;
