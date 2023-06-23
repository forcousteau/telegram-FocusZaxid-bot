import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Form, InputNumber, message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { IVariable } from '../../../types/vars';
import { editVariable, fetchVariables } from '../../../api/vars';

const Settings: React.FC = () => {
  const [form] = useForm();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [vars, setVars] = useState<IVariable[]>();

  const updateData = async () => {
	setLoading(true);

	try {
	  const vars = await fetchVariables();
	  setVars(vars);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати налаштування');
	}
	finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
	updateData().then(() => form.resetFields());
  }, []);

  const onSubmit = async (values) => {
	try {
	  const updates: Promise<void>[] = [];

	  for (const key in values) {
		if (values.hasOwnProperty(key)) {
		  const varId = vars?.find(v => v.name === key)?.id;
		  updates.push(editVariable(varId ?? null, { name: key, value: values[key].toString() }));
		}
	  }

	  await Promise.all(updates);
	  message.success('Налаштування успішно оновлені!');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось оновити налаштування');
	}
	finally {
	  updateData().then(() => form.resetFields());
	  onCancel();
	}
  };

  const onCancel = () => history.push('/');

  return (
	<div className="Settings">
	  <Modal
		title="Налаштування"
		okText="Зберегти"
		cancelText="Відмінити"
		destroyOnClose={true}
		visible={true}
		onCancel={onCancel}
		onOk={form.submit}
	  >
		<Form
		  form={form}
		  initialValues={{
			carDayPayment: vars?.find(v => v.name === 'carDayPayment')?.value,
			hoursAutoCloseWorkShift: vars?.find(v => v.name === 'hoursAutoCloseWorkShift')?.value,
			hoursCloseWorkShiftReminder: vars?.find(v => v.name === 'hoursCloseWorkShiftReminder')?.value
		  }}
		  onFinish={onSubmit}
		>
		  <Form.Item
			name="carDayPayment"
			label="Вартість одного дня машини (грн)"
			rules={[
			  {
				required: true,
				message: 'Необхідно встановити вартість одного дня машини!'
			  }
			]}
		  >
			<InputNumber min={1}/>
		  </Form.Item>

		  <Form.Item
			name="hoursAutoCloseWorkShift"
			label="К-сть годин для автоматичного закриття зміни"
			rules={[
			  {
				required: true,
				message: 'Необхідно встановити к-сть годин для автоматичного закриття зміни!'
			  }
			]}
		  >
			<InputNumber min={1}/>
		  </Form.Item>

		  <Form.Item
			name="hoursCloseWorkShiftReminder"
			label="К-сть годин для нагадування про закриття зміни"
			rules={[
			  {
				required: true,
				message: 'Необхідно встановити к-сть годин для нагадування про закриття зміни!'
			  }
			]}
		  >
			<InputNumber min={1}/>
		  </Form.Item>
		</Form>
	  </Modal>
	</div>
  );
};

export default Settings;
