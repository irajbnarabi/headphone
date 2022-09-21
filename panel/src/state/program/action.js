import {
	createProgramApiCall,
	deleteProgramsApiCall,
	deleteProgramTagsApiCall,
	getProgramDetailsApiCall,
	getProgramsListApiCall,
	updateProgramApiCall,
	updateProgramTagsApiCall,
	uploadProgramImageApiCall,
	searchProgramApiCall,
	enableOrDisableProgramApiCall,
} from './api-handler';
import history from '../../history';
import programTypes from './type';

const getProgramsList = (type, pageNumber) => async (dispatch) => {
	dispatch({
		type: programTypes.GET_PROGRAMS_LIST.request,
		payload: {},
	});
	try {
		const response = await getProgramsListApiCall(type, pageNumber);
		dispatch({
			type: programTypes.GET_PROGRAMS_LIST.success,
			payload: { programs: response.data.data, pageCount: response.data.metadata.pageCount },
		});
	} catch (error) {
		dispatch({
			type: programTypes.GET_PROGRAMS_LIST.failure,
			payload: { error },
		});
	}
};

const getProgramDetails = (type, id) => async (dispatch) => {
	dispatch({
		type: programTypes.GET_PROGRAM_DETAILS.request,
		payload: {},
	});
	try {
		const response = await getProgramDetailsApiCall(type, id);
		dispatch({
			type: programTypes.GET_PROGRAM_DETAILS.success,
			payload: { program: response.data.data },
		});
	} catch (error) {
		dispatch({
			type: programTypes.GET_PROGRAM_DETAILS.failure,
			payload: { error },
		});
	}
};

const deleteProgram = (type, id, currentPage) => async (dispatch) => {
	dispatch({
		type: programTypes.DELETE_PROGRAM.request,
		payload: {},
	});
	try {
		await deleteProgramsApiCall(type, id);
		dispatch({
			type: programTypes.DELETE_PROGRAM.success,
			payload: { programId: id },
		});
		dispatch(getProgramsList(type, currentPage));
	} catch (error) {
		dispatch({
			type: programTypes.DELETE_PROGRAM.failure,
			payload: { error },
		});
	}
};

const uploadProgramImage = (body) => async (dispatch) => {
	dispatch({
		type: programTypes.UPLOAD_PROGRAM_IMAGE.request,
		payload: {},
	});
	try {
		const formData = new FormData();
		for (const key in body) {
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				formData.append(key, body[key]);
			}
		}
		const response = await uploadProgramImageApiCall(formData);
		dispatch({
			type: programTypes.UPLOAD_PROGRAM_IMAGE.success,
			payload: { image: response.data },
		});
	} catch (error) {
		dispatch({
			type: programTypes.UPLOAD_PROGRAM_IMAGE.failure,
			payload: {},
		});
	}
};

const createProgram = (type, body) => async (dispatch) => {
	dispatch({
		type: programTypes.CREATE_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await createProgramApiCall(type, body);
		dispatch({
			type: programTypes.CREATE_PROGRAM.success,
			payload: { program: response.data.data },
		});
		history.push(`/programs/${type}/${response.data.data.id}`);
	} catch (error) {
		dispatch({
			type: programTypes.CREATE_PROGRAM.failure,
			payload: {},
		});
	}
};

const updateProgramTags = (type, programId, tagId, body) => async (dispatch) => {
	dispatch({
		type: programTypes.UPDATE_PROGRAM_TAGS.request,
		payload: {},
	});
	try {
		await updateProgramTagsApiCall(type, programId, tagId, body);
		dispatch({
			type: programTypes.UPDATE_PROGRAM_TAGS.success,
			payload: {},
		});
		dispatch(getProgramDetails(type, programId));
	} catch (error) {
		dispatch({
			type: programTypes.UPDATE_PROGRAM_TAGS.failure,
			payload: {},
		});
	}
};

const deleteProgramTags = (type, programId, tagId) => async (dispatch) => {
	dispatch({
		type: programTypes.DELETE_PROGRAM_TAGS.request,
		payload: {},
	});
	try {
		await deleteProgramTagsApiCall(type, programId, tagId);
		dispatch({
			type: programTypes.DELETE_PROGRAM_TAGS.success,
			payload: {},
		});
		dispatch(getProgramDetails(type, programId));
	} catch (error) {
		dispatch({
			type: programTypes.DELETE_PROGRAM_TAGS.failure,
			payload: {},
		});
	}
};

const updateProgram = (type, id, body) => async (dispatch) => {
	dispatch({
		type: programTypes.UPDATE_PROGRAM.request,
		payload: {},
	});
	try {
		await updateProgramApiCall(type, id, body);
		dispatch({
			type: programTypes.UPDATE_PROGRAM.success,
			payload: {},
		});
		dispatch(getProgramDetails(type, id));
	} catch (error) {
		dispatch({
			type: programTypes.UPDATE_PROGRAM.failure,
			payload: {},
		});
	}
};

const resetCurrentProgram = () => (dispatch) => {
	dispatch({
		type: programTypes.RESET_CURRENT_PROGRAM,
		payload: {},
	});
};

const searchProgram = (type, query) => async (dispatch) => {
	dispatch({
		type: programTypes.SEARCH_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await searchProgramApiCall(type, query);
		dispatch({
			type: programTypes.SEARCH_PROGRAM.success,
			payload: { programs: response.data.data || [] },
		});
	} catch (error) {
		dispatch({
			type: programTypes.SEARCH_PROGRAM.failure,
			payload: {},
		});
	}
};

const enableOrDisableProgram = (id, programType, isEnable) => async (dispatch) => {
	dispatch({
		type: programTypes.ENABLE_OR_DISABLE_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await enableOrDisableProgramApiCall(id, programType, isEnable);
		dispatch({
			type: programTypes.ENABLE_OR_DISABLE_PROGRAM.success,
			payload: { programs: response.data.data || [] },
		});
	} catch (error) {
		dispatch({
			type: programTypes.ENABLE_OR_DISABLE_PROGRAM.failure,
			payload: {},
		});
	}
};

const programActions = {
	getProgramsList,
	getProgramDetails,
	deleteProgram,
	uploadProgramImage,
	createProgram,
	updateProgramTags,
	deleteProgramTags,
	updateProgram,
	resetCurrentProgram,
	searchProgram,
	enableOrDisableProgram,
};

export default programActions;
