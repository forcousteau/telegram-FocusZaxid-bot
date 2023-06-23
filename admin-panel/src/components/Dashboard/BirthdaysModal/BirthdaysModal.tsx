import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { message, Modal } from 'antd';
import { fetchBirthdays } from '../../../api/birthdays';

import { IEmployee } from '../../../types/employees';

const BirthdaysModal: React.FC = () => {
  const history = useHistory();

  const [employees, setEmployees] = useState<IEmployee[]>();

  useEffect(() => {
	updateData();
  }, []);

  const updateData = async () => {
	try {
	  const employees = await fetchBirthdays();
	  setEmployees(employees);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати дані');
	}
  };

  const onClose = () => history.push('/');

  return (
	<Modal
	  title="Дні народження сьогодні"
	  okText="Ок"
	  cancelText="Закрити"
	  destroyOnClose={true}
	  visible={true}
	  onCancel={onClose}
	  onOk={onClose}
	>
	  <ul>
		{
		  !!employees?.length && employees?.map(({ fullName }, i) => (
		    <li key={i}>{fullName}</li>
		  ))
		}

		{ !employees?.length && <p>Сьогодні іменинників нема</p> }
	  </ul>
	</Modal>
  );
}

export default BirthdaysModal;
