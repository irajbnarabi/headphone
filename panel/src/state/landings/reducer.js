import landingsType from './type';

const initialState = {
	carousels: [],
	isLoad: false,
};

const landingReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case landingsType.GET_LANDING.request:
			return {
				...state,
				carousels: payload.carousels,
				isLoad: false,
			};
		case landingsType.GET_LANDING.success:
			return {
				...state,
				carousels: payload.carousels,
				isLoad: true,
			};
		case landingsType.UPDATE_LANDING.request:
			return {
				...state,
				carousels: payload.carousels,
				isLoad: false,
			};
		case landingsType.UPDATE_LANDING.success:
			return {
				...state,
				carousels: payload.carousels,
				isLoad: true,
			};
		default:
			return state;
	}
};
export default landingReducer;
