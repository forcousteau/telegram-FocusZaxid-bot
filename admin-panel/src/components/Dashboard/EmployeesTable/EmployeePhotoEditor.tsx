import React from 'react';
import { Form, message, Modal, Upload } from 'antd';
import { apiURL } from '../../../api/api';
import { InboxOutlined } from '@ant-design/icons';
import { normFile } from '../../../helpers/functions';
import { editEmployee } from '../../../api/employees';

interface IEditorProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
  id: number;
}

const ItemEditor: React.FC<IEditorProps> = (props) => {
  const [form] = Form.useForm();

  const onSubmit = async ({ image }: any) => {
	try {
	  await editEmployee(props.id, { photoName: image[0].response.filename });
	  message.success('Фото успішно змінено!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось змінити фото');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Зміна фото"
	  okText="Зберегти"
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
		labelCol={{ span: 7 }}
		labelAlign="left"
	  >
		<Form.Item label="Фото">
		  <Form.Item name="image" valuePropName="image" getValueFromEvent={normFile} noStyle>
			<Upload.Dragger
			  accept=".png,.jpg"
			  name="image"
			  action={`${apiURL}/images`}
			  withCredentials
			  multiple={false}
			>
			  <p className="ant-upload-drag-icon">
				<InboxOutlined/>
			  </p>
			  <p className="ant-upload-text">Натисніть на цю область або перетягніть сюди зображення</p>
			</Upload.Dragger>
		  </Form.Item>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default ItemEditor;
