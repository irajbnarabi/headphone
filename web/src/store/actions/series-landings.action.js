const seriesActions = (data) => {
	if (data) {
		return {
			type   : 'SERIES_DATA_SET',
			payload: data
		};
	}
	return {
		type   : 'SERIES_NULL_DATA',
		payload: []
	};
};
export default seriesActions;
