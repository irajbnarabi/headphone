const homeActions = (data) => {
	if (data) {
		return {
			type   : 'HOME_DATA_SET',
			payload: data
		};
	}
	return {
		type   : 'HOME_NULL_DATA',
		payload: []
	};
};
export default homeActions;
