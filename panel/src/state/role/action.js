import { getRoleListApiCall, createRoleApiCall, updateRoleApiCall, deleteRoleApiCall, getRoleDetailsApiCall } from './api-handler';
import roleTypes from './type';

const getRoleList = (pageNumber = 1) => async (dispatch) => {
	dispatch({
		type: roleTypes.GET_ROLE_LIST.request,
		payload: {},
	});
	try {
		const response = await getRoleListApiCall(pageNumber);
		dispatch({
			type: roleTypes.GET_ROLE_LIST.success,
			payload: { roleList: response.data.data, pageCount: response.data.metadata?.pageCount },
		});
	} catch (error) {
		dispatch({
			type: roleTypes.GET_ROLE_LIST.failure,
			payload: {},
		});
	}
};

const createRole = (body) => async (dispatch) => {
	dispatch({
		type: roleTypes.CREATE_ROLE.request,
		payload: {},
	});
	try {
		await createRoleApiCall(body);
		dispatch({
			type: roleTypes.CREATE_ROLE.success,
			payload: {},
		});
		dispatch(getRoleList());
	} catch (error) {
		dispatch({
			type: roleTypes.CREATE_ROLE.failure,
			payload: {},
		});
	}
};

const updateRole = (body, id, currentPage) => async (dispatch) => {
	dispatch({
		type: roleTypes.UPDATE_ROLE.request,
		payload: {},
	});
	try {
		await updateRoleApiCall(body, id);
		dispatch({
			type: roleTypes.UPDATE_ROLE.success,
			payload: {},
		});
		dispatch(getRoleList(currentPage));
	} catch (error) {
		dispatch({
			type: roleTypes.UPDATE_ROLE.failure,
			payload: {},
		});
	}
};

const deleteRole = (id, currentPage) => async (dispatch) => {
	dispatch({
		type: roleTypes.DELETE_ROLE.request,
		payload: {},
	});
	try {
		await deleteRoleApiCall(id);
		dispatch({
			type: roleTypes.DELETE_ROLE.success,
			payload: {},
		});
		dispatch(getRoleList(currentPage));
	} catch (error) {
		dispatch({
			type: roleTypes.DELETE_ROLE.failure,
			payload: {},
		});
	}
};

const getRoleDetails = (id, currentPage) => async (dispatch) => {
	dispatch({ type: roleTypes.GET_ROLE_DETAILS.request, payload: {} });
	try {
		const response = await getRoleDetailsApiCall(id);
		dispatch({ type: roleTypes.GET_ROLE_DETAILS.success, payload: { currentRole: response.data.data } });
		dispatch(getRoleList(currentPage));
	} catch (e) {
		dispatch({ type: roleTypes.GET_ROLE_DETAILS.failure, payload: {} });
	}
};

const roleActions = {
	getRoleList,
	createRole,
	updateRole,
	deleteRole,
	getRoleDetails,
};

export default roleActions;
