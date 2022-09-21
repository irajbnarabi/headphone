const movieDetailAction = (data = null, id) => {
	if (data) {
		return {
			id       : id,
			type     : `MOVIE_DETAIL_DATA_SET_${id}`,
			movieData: data,
			isLoad   : true
		};
	}
	return {
		id       : id,
		type     : `MOVIE_DETAIL_DATA_SET_${id}`,
		movieData: {},
		isLoad   : false
	};
};
export default movieDetailAction;
