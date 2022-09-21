import { ApiRequestActionTypes } from '../../common/utils';

const authenticationTypes = {
	LOAD_LOG_IN: 'LOAD_LOG_IN',
	LOG_OUT: 'LOG_OUT',
	SIGN_UP_USER: new ApiRequestActionTypes('SIGN_UP_USER'),
	SIGN_IN_USER: new ApiRequestActionTypes('SIGN_IN_USER'),
	VERIFY_USER: new ApiRequestActionTypes('VERIFY_USER'),
	USER_CREDENTIALS: new ApiRequestActionTypes('USER_CREDENTIALS'),
};
export default authenticationTypes;
