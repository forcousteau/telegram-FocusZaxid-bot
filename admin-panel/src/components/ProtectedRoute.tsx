import React from 'react';
import { Redirect, Route } from 'react-router';

const ProtectedRoute = ({ component: Component, authorized, ...rest }) => (
  <Route {...rest} render={(props) => (
	authorized === true
	  ? <Component {...props} />
	  : <Redirect to='/login'/>
  )}/>
);

export default ProtectedRoute;
