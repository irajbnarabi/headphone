import programTypes from './type';

const initialState = {
	programs: [],
	currentProgram: null,
	currentImage: null,
	imageLoading: false,
	pageCount: 0,
};

const programReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case programTypes.GET_PROGRAMS_LIST.request:
			return {
				...state,
				programs: payload.programs,
				pageCount: payload.pageCount,
				isLoad: false,
			};
		case programTypes.GET_PROGRAMS_LIST.success:
			return {
				...state,
				programs: payload.programs,
				pageCount: payload.pageCount,
				isLoad: true,
			};
		case programTypes.GET_PROGRAM_DETAILS.success:
			return {
				...state,
				currentProgram: payload.program,
			};
		case programTypes.UPLOAD_PROGRAM_IMAGE.request:
			return {
				...state,
				currentImage: null,
				imageLoading: true,
			};
		case programTypes.UPLOAD_PROGRAM_IMAGE.success:
			return {
				...state,
				currentImage: payload.image,
				imageLoading: false,
			};
		case programTypes.UPLOAD_PROGRAM_IMAGE.failure:
			return {
				...state,
				imageLoading: false,
			};
		case programTypes.CREATE_PROGRAM.success:
			return {
				...state,
				currentProgram: payload.program,
			};
		case programTypes.UPDATE_PROGRAM.success:
			return {
				...state,
				//    TODO set currentProgram
			};
		case programTypes.RESET_CURRENT_PROGRAM:
			return {
				...state,
				currentProgram: null,
			};
		case programTypes.SEARCH_PROGRAM.success:
			return {
				...state,
				programs: payload.programs,
				pageCount: null,
				isLoad: true,
			};
		case programTypes.SEARCH_PROGRAM.request:
			return {
				...state,
				programs: payload.programs,
				pageCount: null,
				isLoad: false,
			};
		case programTypes.ENABLE_OR_DISABLE_PROGRAM.success:
			return {
				...state,
			};
		default:
			return state;
	}
};
export default programReducer;
