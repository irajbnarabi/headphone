import fileTypes from './type';

const initFile = {
	file: null,
	loading: false,
	error: false,
};

const fileReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case fileTypes.UPLOAD_IMG.request:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					file: null,
					loading: true,
					error: false,
				},
			};
		case fileTypes.UPLOAD_IMG.success:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					file: payload.file,
					loading: false,
					error: false,
				},
			};
		case fileTypes.UPLOAD_IMG.failure:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					loading: false,
					error: true,
				},
			};
		case fileTypes.UPLOAD_VIDEO.request:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					file: null,
					loading: true,
					error: false,
				},
			};
		case fileTypes.UPLOAD_VIDEO.success:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					file: payload.file,
					loading: false,
					error: false,
				},
			};
		case fileTypes.UPLOAD_VIDEO.failure:
			return {
				...state,
				[payload.id]: {
					...state[payload.id],
					loading: false,
					error: true,
				},
			};
		case fileTypes.RESET_FILE:
			return {
				...state,
				[payload.id]: {
					...initFile,
				},
			};
		default:
			return state;
	}
};

export default fileReducer;
