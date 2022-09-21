const profileReducer = (state = {}, action) => {
	switch (action.type) {
		case 'PROFILE_DATA_SET':
			return action.payload;
		case 'PROFILE_NULL_DATA':
			return state;
		default:
			return state;
	}
};
export default profileReducer;
