import tagTypes from './type';

const initialState = {
	tagList: [],
	pageCount: 0,
	isLoad: false,
};

const tagReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case tagTypes.GET_TAG_LIST.success:
			return {
				...state,
				tagList: payload.tagList,
				pageCount: payload.pageCount,
				isLoad: payload.isLoad,
			};
		case tagTypes.SEARCH_TAG.request:
			return {
				...state,
				isLoad: payload.isLoad,
			};
		case tagTypes.SEARCH_TAG.success:
			return {
				...state,
				pageCount: null,
				tagList: payload.tagList,
				isLoad: payload.isLoad,
			};
		default:
			return state;
	}
};
export default tagReducer;
