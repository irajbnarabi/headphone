import { getSignInUserApiCall, getSignUpUserApiCall, getUserCredentialsApiCall, getVerifyUserApiCall } from './api-handler';
import { getLoginInfo } from './utils';
import * as md5 from 'md5';
import history from '../../history';
import authenticationTypes from './type';

const loadLoginStatus = () => async (dispatch) => {
	const loginInfo = await getLoginInfo();
	dispatch({
		type: authenticationTypes.LOAD_LOG_IN,
		payload: { loginInfo },
	});
	try {
		const loginInfo = await getLoginInfo();
		dispatch({
			type: authenticationTypes.LOAD_LOG_IN,
			payload: { loginInfo },
		});
	} catch (error) {
		dispatch({ type: '' });
	}
};

const signUpUser = (principal) => async (dispatch) => {
	dispatch({
		type: authenticationTypes.SIGN_UP_USER.request,
		payload: {},
	});
	try {
		const response = await getSignUpUserApiCall({ principal });
		const temporaryToken = response.data.data.token;
		dispatch({
			type: authenticationTypes.SIGN_UP_USER.success,
			payload: {
				temporaryToken,
				loginInfo: { principal },
			},
		});
		if (temporaryToken === '') {
			history.push('/login');
		} else if (temporaryToken) {
			history.push('/verify');
		}
	} catch (error) {
		dispatch({
			type: authenticationTypes.SIGN_UP_USER.failure,
			payload: { error },
		});
	}
};

const signInUser = (principal, credential) => async (dispatch) => {
	dispatch({
		type: authenticationTypes.SIGN_IN_USER.request,
		payload: {},
	});
	try {
		const response = await getSignInUserApiCall({
			principal,
			credential: md5(credential),
		});
		const { token } = response.data.data;
		dispatch({
			type: authenticationTypes.SIGN_IN_USER.success,
			payload: {
				loginInfo: {
					token,
					principal,
				},
			},
		});
		localStorage.setItem(
			'loginInfo',
			JSON.stringify({
				token,
				principal,
			})
		);
		setTimeout(() => {
			history.push('/');
		}, 100);
	} catch (error) {
		dispatch({
			type: authenticationTypes.SIGN_IN_USER.failure,
			payload: { error },
		});
	}
};

const verifyUser = (code) => async (dispatch, getState) => {
	dispatch({
		type: authenticationTypes.VERIFY_USER.request,
		payload: {},
	});
	try {
		const { temporaryToken, loginInfo } = getState().authenticationReducer;
		const { principal } = loginInfo;
		const response = await getVerifyUserApiCall({
			principal,
			code,
			token: temporaryToken,
		});
		const { token } = response.data.data;
		dispatch({
			type: authenticationTypes.VERIFY_USER.success,
			payload: {
				loginInfo: {
					token,
					principal,
				},
			},
		});
		localStorage.setItem(
			'loginInfo',
			JSON.stringify({
				token,
				principal,
			})
		);
		history.push('/credentials');
	} catch (error) {
		dispatch({
			type: authenticationTypes.VERIFY_USER.failure,
			payload: { error },
		});
	}
};

const userCredentials = (credential) => async (dispatch, getState) => {
	dispatch({
		type: authenticationTypes.USER_CREDENTIALS.request,
		payload: {},
	});
	try {
		const { principal } = getState().authenticationReducer.loginInfo;
		const response = await getUserCredentialsApiCall({ credential: md5(credential) });
		const { token } = response.data.data;
		dispatch({
			type: authenticationTypes.USER_CREDENTIALS.success,
			payload: {
				loginInfo: {
					token,
					principal,
				},
			},
		});
		localStorage.setItem(
			'loginInfo',
			JSON.stringify({
				token,
				principal,
			})
		);
		history.push('/');
	} catch (error) {
		dispatch({
			type: authenticationTypes.USER_CREDENTIALS.failure,
			payload: { error },
		});
	}
};

const logOut = () => async (dispatch) => {
	dispatch({
		type: authenticationTypes.LOG_OUT,
		payload: {},
	});
	localStorage.removeItem('loginInfo');
	history.push('/login');
};

const authenticationActions = {
	signUpUser,
	signInUser,
	verifyUser,
	userCredentials,
	loadLoginStatus,
	logOut,
};
export default authenticationActions;
