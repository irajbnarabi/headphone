import subscriptionTypes from './type';

const initialState = {
	plans: [],
	discounts: [],
	isLoadPlans: false,
	isLoadDiscounts: false,
};

const subscriptionReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case subscriptionTypes.GET_PLANS.request:
			return {
				...state,
				isLoadPlans: payload.isLoad,
			};
		case subscriptionTypes.GET_PLANS.success:
			return {
				...state,
				plans: payload.planList,
				isLoadPlans: payload.isLoad,
			};
		case subscriptionTypes.SEARCH_PLANS.request:
			return {
				...state,
				isLoadPlans: payload.isLoad,
			};
		case subscriptionTypes.SEARCH_PLANS.success:
			return {
				...state,
				plans: payload.planList,
				isLoadPlans: payload.isLoad,
			};
		case subscriptionTypes.CREATE_PLAN.success:
			return {
				...state,
			};
		case subscriptionTypes.EDIT_PLAN.success:
			return {
				...state,
			};
		case subscriptionTypes.DELETE_PLAN.success:
			return {
				...state,
			};
		case subscriptionTypes.GET_DISCOUNTS.request:
			return {
				...state,
				isLoadDiscounts: payload.isLoad,
			};
		case subscriptionTypes.GET_DISCOUNTS.success:
			return {
				...state,
				discounts: payload.discounts,
				isLoadDiscounts: payload.isLoad,
			};
		case subscriptionTypes.SEARCH_DISCOUNTS.request:
			return {
				...state,
				isLoadDiscounts: payload.isLoad,
			};
		case subscriptionTypes.SEARCH_DISCOUNTS.success:
			return {
				...state,
				discounts: payload.discounts,
				isLoadDiscounts: payload.isLoad,
			};
		case subscriptionTypes.CREATE_DISCOUNT.success:
			return {
				...state,
			};
		case subscriptionTypes.EDIT_DISCOUNT.success:
			return {
				...state,
			};
		case subscriptionTypes.DELETE_DISCOUNTS.success:
			return {
				...state,
			};
		default:
			return state;
	}
};
export default subscriptionReducer;
