import userTypes from './type';

const initialState = {
	userList: [],
	invoices: null,
	pageCount: 0,
	isLoadUsers: null,
	isLoadInvoices: null,
};

const userReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case userTypes.GET_USER_LIST.success:
			return {
				...state,
				userList: payload.userList,
				pageCount: payload.pageCount,
				isLoadUsers: payload.isLoadUsers,
			};
		case userTypes.GET_USER_DETAIL.success: {
			return {
				...state,
				currentUser: payload.currentUser,
				isLoadUsers: payload.isLoadUsers,
			};
		}
		case userTypes.GET_USER_INVOICES.request: {
			return {
				...state,
				isLoadInvoices: payload.isLoadInvoices,
			};
		}
		case userTypes.GET_USER_INVOICES.success: {
			return {
				...state,
				invoices: payload.invoices,
				isLoadInvoices: payload.isLoadInvoices,
			};
		}
		case userTypes.SEARCH_USER_BY_EMAIL.request: {
			return {
				...state,
				isLoadUsers: payload.isLoadUsers,
			};
		}
		case userTypes.SEARCH_USER_BY_EMAIL.success: {
			return {
				...state,
				userList: payload.userList,
				isLoadUsers: payload.isLoadUsers,
			};
		}
		case userTypes.SEARCH_USER_BY_PHONE.request: {
			return {
				...state,
				isLoadUsers: payload.isLoadUsers,
			};
		}
		case userTypes.SEARCH_USER_BY_PHONE.success: {
			return {
				...state,
				userList: payload.userList,
				isLoadUsers: payload.isLoadUsers,
			};
		}
		default:
			return state;
	}
};
export default userReducer;
