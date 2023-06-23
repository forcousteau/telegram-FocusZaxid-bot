import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { checkAuth, login, logout } from '../api/auth';
import AuthContext from '../contexts/AuthContext';

import Loading from './Loading';
import Router from './Router';
import '../styles/App.css';

const App = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const loginHandler = async ({ username, password }) => {
	setLoading(true);

	try {
	  const { login: loggedIn, webadminRole } = await login({ username, password });
	  setAuthorized(loggedIn);
	  setAdminRole(webadminRole);

	  if (!loggedIn) {
		message.warn('Неправильний логін і/або пароль');
	  }
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось увійти');
	}
	finally {
	  setLoading(false);
	}
  };

  const logoutHandler = async () => {
	setLoading(true);

	await logout();
	setAuthorized(false);
	setLoading(false);
  };

  const checkAuthHandler = async () => {
	const { login, webadminRole } = await checkAuth();

	setAuthorized(login && !!webadminRole);
	setAdminRole(webadminRole);
	setLoading(false);
  };

  useEffect(() => {
	checkAuthHandler();
  }, []);

  if (loading) return <Loading/>;

  return (
	<AuthContext.Provider value={{
	  authorized, adminRole,
	  login: loginHandler,
	  logout: logoutHandler,
	  checkAuth: checkAuthHandler
	}}>
	  <div className="App">
		<Router />
	  </div>
	</AuthContext.Provider>
  );
};

export default App;
