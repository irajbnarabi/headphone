const seriesReducer = (state = [], action) => {
	switch (action.type) {
		case 'SERIES_DATA_SET':
			return action.payload;
		case 'SERIES_NULL_DATA':
			return state;
		default:
			return state;
	}
};
export default seriesReducer;
