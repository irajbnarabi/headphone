import { combineReducers } from 'redux';
import authenticationReducer from './authenticate/reducer';
import analyticsReducer from './analitycs/reducer';
import fileReducer from './file/reducer';
import landingReducer from './landings/reducer';
import layoutReducer from './layout/reducer';
import programReducer from './program/reducer';
import tagDefinitionReducer from './tag-definition/reducer';
import tagReducer from './tag/reducer';
import userReducer from './user/reducer';
import roleReducer from './role/reducer';
import ruleReducer from './rule/reducer';
import videoReducer from './video/reducer';
import subscriptionReducer from './subscription/reducer';

const reducers = {
	authenticationReducer,
	analyticsReducer,
	fileReducer,
	landingReducer,
	layoutReducer,
	programReducer,
	tagDefinitionReducer,
	tagReducer,
	userReducer,
	roleReducer,
	ruleReducer,
	videoReducer,
	subscriptionReducer,
};

export default combineReducers(reducers);
