export const searchIntroMoviesAction = (data) => {
	if (data) {
		return {
			type   : 'SEARCH_INTRO_MOVIES_DATA_SET',
			payload: data
		};
	}
	return {
		type   : 'SEARCH_INTRO_MOVIES_NULL_DATA',
		payload: []
	};
};

export const searchIntroSeriesAction = (data) => {
	if (data) {
		return {
			type   : 'SEARCH_INTRO_SERIES_DATA_SET',
			payload: data
		};
	}
	return {
		type   : 'SEARCH_INTRO_SERIES_NULL_DATA',
		payload: []
	};
};
