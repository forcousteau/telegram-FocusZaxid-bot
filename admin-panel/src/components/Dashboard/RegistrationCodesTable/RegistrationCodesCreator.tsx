import React from 'react';
import { Checkbox, Form, Input, message, Modal } from 'antd';
import { createRegistrationCodes } from '../../../api/registrationCodes';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
}

const RegistrationCodesCreator: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ codes }: any) => {
	try {
	  const filteredCodes = codes.split('\n').map(code => code.trim()).filter(code => code);

	  if (!filteredCodes.length) {
	    return message.warn('Не додано жодного коду');
	  }

	  await createRegistrationCodes(filteredCodes);
	  message.success('Реєстраційні коди успішно створено!');

	  form.resetFields();

	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити реєстраційні коди');
	}
  };

  return (
	<Modal
	  title="Створення реєстраційних кодів"
	  className="RegistrationCodesCreator"
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
		labelCol={{ span: 8 }}
		labelAlign="left"
	  >
		<Form.Item
		  name="codes"
		  label="Реєстраційні коди"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести коди!'
			}
		  ]}
		>
		  <Input.TextArea placeholder="Введіть коди по одному на рядок"/>
		</Form.Item>

		<p style={{ textAlign: 'right' }}>
		  Згенерувати коди можна на {' '}
		  <a href="https://www.random.org/strings/" target="_blank" rel="noreferrer noopener">
		  	random.org/strings
		  </a>
		</p>
	  </Form>
	</Modal>
  );
};

export default RegistrationCodesCreator;
