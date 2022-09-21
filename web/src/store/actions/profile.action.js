const profileActions = (data) => {
	if (data) {
		return {
			type   : 'PROFILE_DATA_SET',
			payload: {
				profile: data,
				isLoad : true
			}
		};
	}
	return {
		type   : 'PROFILE_NULL_DATA',
		payload: {}
	};
};
export default profileActions;
