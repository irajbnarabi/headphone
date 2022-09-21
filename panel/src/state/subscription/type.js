import { ApiRequestActionTypes } from '../../common/utils';

const subscriptionTypes = {
	GET_PLANS: new ApiRequestActionTypes('GET_PLANS'),
	CREATE_PLAN: new ApiRequestActionTypes('CREATE_PLAN'),
	EDIT_PLAN: new ApiRequestActionTypes('EDIT_PLAN'),
	DELETE_PLAN: new ApiRequestActionTypes('DELETE_PLAN'),
	SEARCH_PLANS: new ApiRequestActionTypes('SEARCH_PLANS'),
	GET_DISCOUNTS: new ApiRequestActionTypes('GET_DISCOUNTS'),
	CREATE_DISCOUNT: new ApiRequestActionTypes('CREATE_DISCOUNT'),
	EDIT_DISCOUNT: new ApiRequestActionTypes('EDIT_DISCOUNT'),
	DELETE_DISCOUNTS: new ApiRequestActionTypes('DELETE_DISCOUNTS'),
	SEARCH_DISCOUNTS: new ApiRequestActionTypes('SEARCH_DISCOUNTS'),
};
export default subscriptionTypes;
