import analyticsTypes from './type';

const initialState = {
	isLoad: false,
	data: null,
	hotData: null,
	isLoadHot: false,
	hotTotalPages: 0,
};

const analyticsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case analyticsTypes.GET_ANALYTICS.request:
			return {
				...state,
				isLoad: false,
			};
		case analyticsTypes.GET_ANALYTICS.success:
			return {
				...state,
				isLoad: true,
				data: payload.data,
			};
		case analyticsTypes.GET_ANALYTICS.failure:
			return {
				...state,
				isLoad: true,
				data: null,
			};
		case analyticsTypes.GET_HOTS.request:
			return {
				...state,
				isLoadHot: false,
			};
		case analyticsTypes.GET_HOTS.success:
			return {
				...state,
				isLoadHot: true,
				hotData: payload.hotData,
				hotTotalPages: payload.hotTotalPages,
			};
		case analyticsTypes.GET_HOTS.failure:
			return {
				...state,
				isLoadHot: true,
				hotData: null,
			};
		default:
			return state;
	}
};
export default analyticsReducer;
