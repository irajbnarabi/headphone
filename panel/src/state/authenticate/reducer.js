import authenticationTypes from './type';

const initialState = {
	isLoggedIn: false,
	loginInfo: null,
	temporaryToken: '',
};

const authenticationReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case authenticationTypes.LOAD_LOG_IN:
			return {
				...state,
				isLoggedIn: true,
				loginInfo: payload.loginInfo,
			};
		case authenticationTypes.SIGN_UP_USER.success:
			return {
				...state,
				loginInfo: payload.loginInfo,
				temporaryToken: payload.temporaryToken,
			};
		case authenticationTypes.SIGN_IN_USER.success:
			return {
				...state,
				isLoggedIn: true,
				loginInfo: payload.loginInfo,
			};
		case authenticationTypes.VERIFY_USER.success:
			return {
				...state,
				temporaryToken: '',
				loginInfo: payload.loginInfo,
			};
		case authenticationTypes.USER_CREDENTIALS.success:
			return {
				...state,
				isLoggedIn: true,
				loginInfo: payload.loginInfo,
			};
		case authenticationTypes.LOG_OUT:
			return {
				...initialState,
			};
		default:
			return state;
	}
};
export default authenticationReducer;
