import React from 'react';

interface IAuthContextProps {
  authorized: boolean;
  adminRole: any;
  login: ({ username, password }) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = React.createContext<IAuthContextProps>({
  authorized: false,
  adminRole: {},
  login: () => {},
  logout: () => {},
  checkAuth: () => {}
});

export default AuthContext;
