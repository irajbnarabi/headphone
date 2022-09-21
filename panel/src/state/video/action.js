import { createVideoOfProgramApiCall, deleteVideoOfProgramApiCall, editVideoOfProgramApiCall } from './api-handler';
import programActions from '../program/action';
import videoTypes from './type';

const createVideoForSpecificProgram = (programId, programType, body) => async (dispatch) => {
	dispatch({
		type: videoTypes.CREATE_VIDEO_OF_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await createVideoOfProgramApiCall(programId, programType, body);
		dispatch({
			type: videoTypes.CREATE_VIDEO_OF_PROGRAM.success,
			payload: { video: response },
		});
		dispatch(programActions.getProgramDetails(programType, programId));
	} catch (error) {
		dispatch({
			type: videoTypes.CREATE_VIDEO_OF_PROGRAM.failure,
			payload: {},
		});
	}
};

const editVideoForSpecificProgram = (programId, programType, body) => async (dispatch) => {
	dispatch({
		type: videoTypes.EDIT_VIDEO_OF_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await editVideoOfProgramApiCall(programId, programType, body);
		dispatch({
			type: videoTypes.EDIT_VIDEO_OF_PROGRAM.success,
			payload: { video: response },
		});
		dispatch(programActions.getProgramDetails(programType, programId));
	} catch (error) {
		dispatch({
			type: videoTypes.EDIT_VIDEO_OF_PROGRAM.failure,
			payload: {},
		});
	}
};

const deleteVideoForSpecificProgram = (programId, programType, videoId) => async (dispatch) => {
	dispatch({
		type: videoTypes.DELETE_VIDEO_OF_PROGRAM.request,
		payload: {},
	});
	try {
		const response = await deleteVideoOfProgramApiCall(programId, programType, videoId);
		dispatch({
			type: videoTypes.DELETE_VIDEO_OF_PROGRAM.success,
			payload: { video: response },
		});
		dispatch(programActions.getProgramDetails(programType, programId));
	} catch (error) {
		dispatch({
			type: videoTypes.DELETE_VIDEO_OF_PROGRAM.failure,
			payload: {},
		});
	}
};

const videoActions = {
	createVideoForSpecificProgram,
	editVideoForSpecificProgram,
	deleteVideoForSpecificProgram,
};
export default videoActions;
