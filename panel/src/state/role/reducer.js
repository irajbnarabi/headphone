import roleTypes from './type';

const initialState = {
	roleList: [],
	pageCount: 0,
	currentRole: null,
};

const roleReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case roleTypes.GET_ROLE_LIST.success:
			return {
				...state,
				roleList: payload.roleList,
				pageCount: payload.pageCount,
			};
		case roleTypes.GET_ROLE_DETAILS.success:
			return {
				...state,
				currentRole: payload.currentRole,
			};
		default:
			return state;
	}
};
export default roleReducer;
