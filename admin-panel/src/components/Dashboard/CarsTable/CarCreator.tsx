import React, { useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';

import { createCar } from '../../../api/cars';
import { FuelType } from '../../../types/cars';

interface IProps {
  visible: boolean;
  onCancel?: () => any;
  afterSubmit?: () => any;
  fuelTypes?: {text: string, value: FuelType}[];
}

const CarCreator: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onSubmit = async ({     
    name,
    fuelType,
    fuelConsumption,
    isCompanyProperty,
    isActive
    }: any) => {
	try {
	  await createCar(
        name ?? '',
        fuelType,
        fuelConsumption,
        isCompanyProperty,
        isActive
        );
	  message.success('Автомобіль успішно створено!');

	  form.resetFields();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось створити автомобіль');
	}
	finally {
	  props.afterSubmit?.call(null);
	  props.onCancel?.call(null);
	}
  };

  return (
	<Modal
	  title="Створення автомобілю"
	  className="CarCreator"
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
		  label="Назва автомобіля"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести назву автомобіля!'
			}
		  ]}
		>
		  <Input placeholder="Введіть назву автомобіля"/>
		</Form.Item>

		<Form.Item
		  name="fuelType"
		  label="Тип палива"
		  rules={[
			{
			  required: true,
			  message: 'Виберіть тип палива'
			}
		  ]}
		>
		  <Select
			placeholder="Виберіть тип палива"
			loading={loading}
			notFoundContent="Не вдалося отримати інформацію"
		  >
			{
			  props.fuelTypes?.map(({text, value}) => {
				return <Select.Option key={'fuelType'} value={value}>{text}</Select.Option>
			  })
			}
		  </Select>
		</Form.Item>

		<Form.Item
		  name="fuelConsumption"
		  label="Витрати палива"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно ввести витрату палива'
			}
		  ]}
		>
		  <InputNumber
			min={1}
			placeholder="літрів"
		  />
		</Form.Item>

		<Form.Item
		  name="isCompanyProperty"
		  label="Власність фірми"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно вибрати значення!'
			}
		  ]}
		  >
            <Select
              loading={loading}
              notFoundContent="Не вдалося отримати інформацію"
			  placeholder="Чи автомобіль власність компанії"
            >
              {
                // @ts-ignore
                <Select.Option key={'isCompanyProperty'} value={true}>
                  Так
                </Select.Option>
              }
			  {
                // @ts-ignore
                <Select.Option key={'isCompanyProperty'} value={false}>
                  Ні
                </Select.Option>
              }
            </Select>
		</Form.Item>
		<Form.Item
		  name="isActive"
		  label="Статус"
		  rules={[
			{
			  required: true,
			  message: 'Необхідно вибрати значення!'
			}
		  ]}
		  >
            <Select
              loading={loading}
              notFoundContent="Не вдалося отримати інформацію"
			  placeholder="Чи в експлуатації зараз автомобіль"
            >
              {
                // @ts-ignore
                <Select.Option key={'isActive'} value={true}>
                  Активний
                </Select.Option>
              }
			  {
                // @ts-ignore
                <Select.Option key={'isActive'} value={false}>
                  Неактивний
                </Select.Option>
              }
            </Select>
		</Form.Item>
	  </Form>
	</Modal>
  );
};

export default CarCreator;
