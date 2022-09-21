import {
	createDiscountApiCall,
	createPlanApiCall,
	deleteDiscountApiCall,
	deletePlanApiCall,
	editDiscountApiCall,
	editPlanApiCall,
	getDiscountsApiCall,
	getPlansApiCall,
	searchDiscountsApiCall,
	searchPlansApiCall,
} from './api-handler';
import subscriptionTypes from './type';

const getPlans = (type = null) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.GET_PLANS.request,
		payload: { isLoad: false },
	});
	try {
		const response = await getPlansApiCall(type);
		dispatch({
			type: subscriptionTypes.GET_PLANS.success,
			payload: { isLoad: true, planList: response.data.data },
		});
	} catch (e) {
		dispatch({
			type: subscriptionTypes.GET_PLANS.failure,
			payload: {},
		});
	}
};

const createPlan = (form) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.CREATE_PLAN.request,
		payload: {},
	});
	try {
		const response = await createPlanApiCall(form);
		dispatch({
			type: subscriptionTypes.CREATE_PLAN.success,
			payload: { isLoad: true, plan: response.data.data },
		});
		dispatch(getPlans());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.CREATE_PLAN.failure,
			payload: {},
		});
	}
};

const editPlan = (id, form) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.EDIT_PLAN.request,
		payload: {},
	});
	try {
		const response = await editPlanApiCall(id, form);
		dispatch({
			type: subscriptionTypes.EDIT_PLAN.success,
			payload: { isLoad: true, plan: response.data.data },
		});
		dispatch(getPlans());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.EDIT_PLAN.failure,
			payload: {},
		});
	}
};

const deletePlan = (id) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.DELETE_PLAN.request,
		payload: {},
	});
	try {
		const response = await deletePlanApiCall(id);
		dispatch({
			type: subscriptionTypes.DELETE_PLAN.success,
			payload: { isLoad: true, plan: response.data.data },
		});
		dispatch(getPlans());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.DELETE_PLAN.failure,
			payload: {},
		});
	}
};

const getDiscounts = () => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.GET_DISCOUNTS.request,
		payload: { isLoad: false },
	});
	try {
		const response = await getDiscountsApiCall();
		dispatch({
			type: subscriptionTypes.GET_DISCOUNTS.success,
			payload: { isLoad: true, discounts: response.data.data },
		});
	} catch (e) {
		dispatch({
			type: subscriptionTypes.GET_DISCOUNTS.failure,
			payload: {},
		});
	}
};

const createDiscount = (form) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.CREATE_DISCOUNT.request,
		payload: { isLoad: false },
	});
	try {
		const response = await createDiscountApiCall(form);
		dispatch({
			type: subscriptionTypes.CREATE_DISCOUNT.success,
			payload: { isLoad: true, discounts: response.data.data },
		});
		dispatch(getDiscounts());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.CREATE_DISCOUNT.failure,
			payload: {},
		});
	}
};

const editDiscount = (id, form) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.EDIT_DISCOUNT.request,
		payload: { isLoad: false },
	});
	try {
		const response = await editDiscountApiCall(id, form);
		dispatch({
			type: subscriptionTypes.EDIT_DISCOUNT.success,
			payload: { isLoad: true, discounts: response.data.data },
		});
		dispatch(getDiscounts());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.EDIT_DISCOUNT.failure,
			payload: {},
		});
	}
};

const deleteDiscount = (id) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.DELETE_DISCOUNTS.request,
		payload: { isLoad: false },
	});
	try {
		const response = await deleteDiscountApiCall(id);
		dispatch({
			type: subscriptionTypes.DELETE_DISCOUNTS.success,
			payload: { isLoad: true, discounts: response.data.data },
		});
		dispatch(getDiscounts());
	} catch (e) {
		dispatch({
			type: subscriptionTypes.DELETE_DISCOUNTS.failure,
			payload: {},
		});
	}
};

const searchPlans = (prefix) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.SEARCH_PLANS.request,
		payload: { isLoad: false },
	});
	try {
		const response = await searchPlansApiCall(prefix);
		dispatch({
			type: subscriptionTypes.SEARCH_PLANS.success,
			payload: { isLoad: true, planList: response.data.data },
		});
	} catch (e) {
		dispatch({
			type: subscriptionTypes.SEARCH_PLANS.failure,
			payload: {},
		});
	}
};

const searchDiscounts = (prefix) => async (dispatch) => {
	dispatch({
		type: subscriptionTypes.SEARCH_DISCOUNTS.request,
		payload: { isLoad: false },
	});
	try {
		const response = await searchDiscountsApiCall(prefix);
		dispatch({
			type: subscriptionTypes.SEARCH_DISCOUNTS.success,
			payload: { isLoad: true, discounts: response.data.data },
		});
	} catch (e) {
		dispatch({
			type: subscriptionTypes.SEARCH_DISCOUNTS.failure,
			payload: {},
		});
	}
};

const subscriptionActions = {
	getPlans,
	searchPlans,
	createPlan,
	editPlan,
	deletePlan,
	getDiscounts,
	createDiscount,
	editDiscount,
	deleteDiscount,
	searchDiscounts,
};
export default subscriptionActions;
