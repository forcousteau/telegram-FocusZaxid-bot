import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/Login.css';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();

  if (authContext.authorized) {
	history.push('/');
  }

  return (
	<Row justify="center" align="middle" className="FormContainer">
	  <Col xs={18} sm={12} lg={5}>
		<h1>Авторизація</h1>

		<Form
		  initialValues={{ remember: true }}
		  className="LoginForm"
		  onFinish={({ username, password }) => authContext.login({ username, password })}
		>
		  <Form.Item
			name="username"
			rules={[
			  {
				required: true,
				message: 'Введіть ім\'я користувача!'
			  }
			]}
		  >
			<Input
			  prefix={<UserOutlined/>}
			  placeholder="Ім'я користувача"
			/>
		  </Form.Item>
		  <Form.Item
			name="password"
			rules={[
			  {
				required: true,
				message: 'Введіть свій пароль!'
			  }
			]}
		  >
			<Input.Password
			  prefix={<LockOutlined/>}
			  placeholder="Пароль"
			/>
		  </Form.Item>
		  <Form.Item>
			<Button type="primary" htmlType="submit" className="LoginFormButton">
			  Увійти
			</Button>
		  </Form.Item>
		</Form>
	  </Col>
	</Row>
  );
};

export default Login;
