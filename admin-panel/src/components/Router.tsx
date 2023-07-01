import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import NotFound from './NotFound';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import EmployeesTable from './Dashboard/EmployeesTable/EmployeesTable';
import PositionsTable from './Dashboard/PositionsTable/PositionsTable';
import PositionCategoriesTable from './Dashboard/PositionCategoriesTable/PositionCategoriesTable';
import RegionsTable from './Dashboard/RegionsTable/RegionsTable';
import ObjectsTable from './Dashboard/ObjectsTable/ObjectsTable';
import LocationChecksTable from './Dashboard/LocationChecksTable/LocationChecksTable';
import RegistrationCodesTable from './Dashboard/RegistrationCodesTable/RegistrationCodesTable';
import ContractorsTable from './Dashboard/ContractorsTable/ContractorsTable';
import BirthdaysModal from './Dashboard/BirthdaysModal/BirthdaysModal';
import Settings from './Dashboard/Settings/Settings';
import AdminsTable from './Dashboard/Admins/AdminsTable';
import AuthContext from '../contexts/AuthContext';
import AppealsTable from './Dashboard/Appeals/AppealsTable';
import WorkingHoursChangesTable from './Dashboard/WorkingHoursChangesTable/WorkingHoursChangesTable';
import InteractiveTable from './Dashboard/InteractiveTable/InteractiveTable';
import CarsTable from './Dashboard/CarsTable/CarsTable';

const Router: React.FC = () => {
  const { authorized, adminRole } = useContext(AuthContext);

  return (
	<BrowserRouter>
	  <Switch>
		<ProtectedRoute exact path="/" authorized={authorized} component={() =>
		  <Redirect to="/employees"/>
		}/>
		<ProtectedRoute exact path="/employees" authorized={authorized} component={() =>
		  <Dashboard>
			<EmployeesTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/contractors" authorized={authorized} component={() =>
		  <Dashboard>
			<ContractorsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/positions" authorized={authorized} component={() =>
		  <Dashboard>
			<PositionsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/categories" authorized={authorized} component={() =>
		  <Dashboard>
			<PositionCategoriesTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/regions" authorized={authorized} component={() =>
		  <Dashboard>
			<RegionsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/objects" authorized={authorized} component={() =>
		  <Dashboard>
			<ObjectsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/cars" authorized={authorized} component={() =>
		  <Dashboard>
			<CarsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/appeals" authorized={authorized} component={() =>
		  <Dashboard>
			<AppealsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/checks" authorized={authorized} component={() =>
		  <Dashboard>
			<LocationChecksTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/interactive-table" authorized={authorized} component={() =>
		  <Dashboard>
			<InteractiveTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/working-hours-changes" authorized={authorized} component={() =>
		  <Dashboard>
			<WorkingHoursChangesTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/codes" authorized={authorized} component={() =>
		  <Dashboard>
			<RegistrationCodesTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/birthdays" authorized={authorized} component={() =>
		  <Dashboard>
			<BirthdaysModal/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/admins" authorized={authorized && adminRole?.writeAccess} component={() =>
		  <Dashboard>
			<AdminsTable/>
		  </Dashboard>
		}/>
		<ProtectedRoute exact path="/settings" authorized={authorized && adminRole?.writeAccess} component={() =>
		  <Dashboard>
			<Settings/>
		  </Dashboard>
		}/>
		<Route exact path="/login" component={Login}/>
		<Route component={NotFound}/>
	  </Switch>
	</BrowserRouter>
  );
};

export default Router;
