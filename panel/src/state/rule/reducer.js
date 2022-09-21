import ruleTypes from './type';

const initialState = {
	ruleList: [],
	pageCount: 0,
	currentRule: null,
};

const ruleReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ruleTypes.GET_RULE_LIST.success:
			return {
				...state,
				ruleList: payload.ruleList,
				pageCount: payload.pageCount,
			};
		case ruleTypes.GET_RULE_DETAILS.success:
			return {
				...state,
				currentRule: payload.currentRule,
			};
		default:
			return state;
	}
};
export default ruleReducer;
