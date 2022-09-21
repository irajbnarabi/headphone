import { ApiRequestActionTypes } from '../../common/utils';

const userTypes = {
	GET_USER_LIST: new ApiRequestActionTypes('GET_USER_LIST'),
	GET_USER_DETAIL: new ApiRequestActionTypes('GET_USER_DETAIL'),
	CREATE_USER: new ApiRequestActionTypes('CREATE_USER'),
	UPDATE_USER: new ApiRequestActionTypes('UPDATE_USER'),
	DELETE_USER: new ApiRequestActionTypes('DELETE_USER'),
	GET_USER_INVOICES: new ApiRequestActionTypes('GET_USER_INVOICES'),
	SEARCH_USER_BY_EMAIL: new ApiRequestActionTypes('SEARCH_USER_BY_EMAIL'),
	SEARCH_USER_BY_PHONE: new ApiRequestActionTypes('SEARCH_USER_BY_PHONE'),
};
export default userTypes;
