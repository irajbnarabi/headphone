const homeReducer = (state = [], action) => {
	switch (action.type) {
		case 'HOME_DATA_SET':
			return action.payload;
		case 'HOME_NULL_DATA':
			return state;
		default:
			return state;
	}
};
export default homeReducer;