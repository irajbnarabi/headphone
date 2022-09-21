import videoTypes from './type';

const videoReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case videoTypes.CREATE_VIDEO_OF_PROGRAM.success:
			return {
				...state,
				currentVideo: payload,
			};
		case videoTypes.EDIT_VIDEO_OF_PROGRAM.success:
			return {
				...state,
				currentVideo: payload,
			};
		case videoTypes.DELETE_VIDEO_OF_PROGRAM.success:
			return {
				...state,
				currentVideo: payload,
			};
		default:
			return state;
	}
};
export default videoReducer;
