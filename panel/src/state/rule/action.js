import { createRuleApiCall, deleteRuleApiCall, getRuleDetailsApiCall, getRuleListApiCall, updateRuleApiCall } from './api-handler';
import ruleTypes from './type';

const getRuleList = (pageNumber = 1) => async (dispatch) => {
	dispatch({
		type: ruleTypes.GET_RULE_LIST.request,
		payload: {},
	});
	try {
		const response = await getRuleListApiCall(pageNumber);
		dispatch({
			type: ruleTypes.GET_RULE_LIST.success,
			payload: { ruleList: response.data.data, pageCount: response.data.metadata?.pageCount },
		});
	} catch (error) {
		dispatch({
			type: ruleTypes.GET_RULE_LIST.failure,
			payload: {},
		});
	}
};

const createRule = (body) => async (dispatch) => {
	dispatch({
		type: ruleTypes.CREATE_RULE.request,
		payload: {},
	});
	try {
		await createRuleApiCall(body);
		dispatch({
			type: ruleTypes.CREATE_RULE.success,
			payload: {},
		});
		dispatch(getRuleList());
	} catch (error) {
		dispatch({
			type: ruleTypes.CREATE_RULE.failure,
			payload: {},
		});
	}
};

const updateRule = (body, id, currentPage) => async (dispatch) => {
	dispatch({
		type: ruleTypes.UPDATE_RULE.request,
		payload: {},
	});
	try {
		await updateRuleApiCall(body, id);
		dispatch({
			type: ruleTypes.UPDATE_RULE.success,
			payload: {},
		});
		dispatch(getRuleList(currentPage));
	} catch (error) {
		dispatch({
			type: ruleTypes.UPDATE_RULE.failure,
			payload: {},
		});
	}
};

const deleteRule = (id, currentPage) => async (dispatch) => {
	dispatch({
		type: ruleTypes.DELETE_RULE.request,
		payload: {},
	});
	try {
		await deleteRuleApiCall(id);
		dispatch({
			type: ruleTypes.DELETE_RULE.success,
			payload: {},
		});
		dispatch(getRuleList(currentPage));
	} catch (error) {
		dispatch({
			type: ruleTypes.DELETE_RULE.failure,
			payload: {},
		});
	}
};

const getRuleDetails = (id, currentPage) => async (dispatch) => {
	dispatch({ type: ruleTypes.GET_RULE_DETAILS.request, payload: {} });
	try {
		const response = await getRuleDetailsApiCall(id);
		dispatch({ type: ruleTypes.GET_RULE_DETAILS.success, payload: { currentRule: response.data.data } });
		dispatch(getRuleList(currentPage));
	} catch (e) {
		dispatch({ type: ruleTypes.GET_RULE_DETAILS.failure, payload: {} });
	}
};

const ruleActions = {
	getRuleList,
	createRule,
	updateRule,
	deleteRule,
	getRuleDetails,
};
export default ruleActions;
