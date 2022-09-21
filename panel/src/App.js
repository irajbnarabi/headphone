import './assets/styles/base.scss';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from './view/pages/home/home';
import NotFoundPage from './view/pages/not-found/not-found';
import Programs from './view/pages/programs/Programs';
import Program from './view/pages/programs/Program/Program';
import TagDefinition from './view/pages/tag-definition/TagDefinition';
import TagsPage from './view/pages/tags/Tag';
import Users from './view/pages/users/users/Users';
import Roles from './view/pages/users/roles/Roles';
import Rules from './view/pages/users/rules/Rules';
import LandingsPage from './view/pages/landings/Landings';
import SubscriptionPage from './view/pages/subscription/Subscription';
import UserOperation from './view/pages/users/users/user-operation/UserOperation';
import { getLoginInfo } from './state/authenticate/utils';
import AnalyticsPage from './view/pages/analytics/Analytics';
import SignUpPage from './view/pages/authentication/signUp';
import VerifyPage from './view/pages/authentication/verify';
import LoginPage from './view/pages/authentication/login';
import CredentialPage from './view/pages/authentication/credentials';

const App = () => {
	const isLoggedIn = getLoginInfo();

	const PrivateRoute = ({ component: Component, ...rest }) => <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to='/login' />)} />;

	const PublicRoute = ({ component: Component, restricted, ...rest }) => <Route {...rest} render={(props) => (isLoggedIn && restricted ? <Redirect to='/dashboard' /> : <Component {...props} />)} />;

	return (
		<div className='App'>
			<Switch>
				<PrivateRoute component={HomePage} path='/' exact />
				<PrivateRoute component={Programs} path='/programs' exact />
				<PrivateRoute component={Program} path='/programs/:type/:id' exact />
				<PrivateRoute component={Program} path='/new-program/:type' exact />
				<PrivateRoute component={TagDefinition} path='/tag-definition' exact />
				<PrivateRoute component={TagsPage} path='/tags' exact />
				<PrivateRoute component={Users} path='/users' exact />
				<PrivateRoute component={UserOperation} path='/users/add' exact />
				<PrivateRoute component={Roles} path='/users/roles' exact />
				<PrivateRoute component={Rules} path='/users/rules' exact />
				<PrivateRoute component={UserOperation} path='/users/:id' exact />
				<PublicRoute restricted={false} component={SignUpPage} path='/signUp' exact />
				<PublicRoute restricted={false} component={VerifyPage} path='/verify' exact />
				<PublicRoute restricted={false} component={LoginPage} path='/login' exact />
				<PublicRoute restricted={false} component={CredentialPage} path='/credentials' exact />
				<PublicRoute restricted={false} component={LandingsPage} path='/landings/:type' exact />
				<PublicRoute restricted={false} component={SubscriptionPage} path='/subscription' exact />
				<PublicRoute restricted={false} component={AnalyticsPage} path='/analytics/:eventName' exact />
				<Route path='/404' component={NotFoundPage} />
				<Redirect to='/404' />
			</Switch>
		</div>
	);
};

export default App;
