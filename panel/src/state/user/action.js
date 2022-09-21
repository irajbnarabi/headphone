import {
	createUserApiCall,
	deleteUserApiCall,
	getUserDetailApiCall,
	getUserInvoicesApiCall,
	getUserListApiCall,
	searchUserByEmailApiCall,
	searchUserByPhoneApiCall,
	updateUserApiCall,
} from './api-handler';
import toastr from 'toastr';
import userTypes from './type';

const getUserList = (pageNumber = 1) => async (dispatch) => {
	dispatch({
		type: userTypes.GET_USER_LIST.request,
		payload: {
			isLoadUsers: null,
		},
	});
	try {
		const response = await getUserListApiCall(pageNumber);
		dispatch({
			type: userTypes.GET_USER_LIST.success,
			payload: {
				userList: response.data.data,
				pageCount: response.data.metadata?.pageCount,
				isLoadUsers: true,
			},
		});
	} catch (error) {
		dispatch({
			type: userTypes.GET_USER_LIST.failure,
			payload: {
				isLoadUsers: true,
			},
		});
	}
};

const getUserDetail = (userId) => async (dispatch) => {
	dispatch({
		type: userTypes.GET_USER_DETAIL.request,
		payload: {
			currentUser: null,
			isLoadUsers: null,
		},
	});
	try {
		const response = await getUserDetailApiCall(userId);
		dispatch({
			type: userTypes.GET_USER_DETAIL.success,
			payload: {
				currentUser: response.data.data,
				isLoadUsers: true,
			},
		});
	} catch (error) {
		dispatch({
			type: userTypes.GET_USER_DETAIL.failure,
			payload: {
				isLoadUsers: true,
			},
		});
	}
};

const createUser = (body) => async (dispatch) => {
	dispatch({
		type: userTypes.CREATE_USER.request,
		payload: {},
	});
	try {
		await createUserApiCall(body);
		dispatch({
			type: userTypes.CREATE_USER.success,
			payload: {},
		});
		toastr.success('کاربر ایجاد شد');
	} catch (error) {
		dispatch({
			type: userTypes.CREATE_USER.failure,
			payload: {},
		});
	}
};

const updateUser = (body, id) => async (dispatch) => {
	dispatch({
		type: userTypes.UPDATE_USER.request,
		payload: {},
	});
	try {
		await updateUserApiCall(body, id);
		dispatch({
			type: userTypes.UPDATE_USER.success,
			payload: {},
		});
		toastr.success('ویرایش کاربر انجام شد');
	} catch (error) {
		dispatch({
			type: userTypes.UPDATE_USER.failure,
			payload: {},
		});
	}
};

const deleteUser = (id, currentPage) => async (dispatch) => {
	dispatch({
		type: userTypes.DELETE_USER.request,
		payload: {},
	});
	try {
		await deleteUserApiCall(id);
		dispatch({
			type: userTypes.DELETE_USER.success,
			payload: {},
		});
		dispatch(getUserList(currentPage));
	} catch (error) {
		dispatch({
			type: userTypes.DELETE_USER.failure,
			payload: {},
		});
	}
};

const getUserInvoices = (id) => async (dispatch) => {
	dispatch({
		type: userTypes.GET_USER_INVOICES.request,
		payload: {
			isLoadInvoices: null,
		},
	});
	try {
		const response = await getUserInvoicesApiCall(id);
		dispatch({
			type: userTypes.GET_USER_INVOICES.success,
			payload: {
				invoices: response.data.data,
				isLoadInvoices: true,
			},
		});
	} catch (error) {
		dispatch({
			type: userTypes.GET_USER_INVOICES.failure,
			payload: {
				isLoadInvoices: true,
			},
		});
	}
};

const searchUsersByEmail = (email) => async (dispatch) => {
	dispatch({
		type: userTypes.SEARCH_USER_BY_EMAIL.request,
		payload: {
			isLoadUsers: false,
		},
	});
	try {
		const response = await searchUserByEmailApiCall(email);
		dispatch({
			type: userTypes.SEARCH_USER_BY_EMAIL.success,
			payload: {
				userList: response.data.data,
				isLoadUsers: true,
			},
		});
	} catch (e) {
		dispatch({
			type: userTypes.SEARCH_USER_BY_EMAIL.failure,
			payload: {},
		});
	}
};

const searchUsersByPhone = (phone) => async (dispatch) => {
	dispatch({
		type: userTypes.SEARCH_USER_BY_PHONE.request,
		payload: {
			isLoadUsers: false,
		},
	});
	try {
		const response = await searchUserByPhoneApiCall(phone);
		dispatch({
			type: userTypes.SEARCH_USER_BY_PHONE.success,
			payload: {
				userList: response.data.data,
				isLoadUsers: true,
			},
		});
	} catch (e) {
		dispatch({
			type: userTypes.SEARCH_USER_BY_PHONE.failure,
			payload: {},
		});
	}
};

const userActions = {
	getUserList,
	getUserDetail,
	createUser,
	updateUser,
	deleteUser,
	getUserInvoices,
	searchUsersByEmail,
	searchUsersByPhone,
};
export default userActions;
