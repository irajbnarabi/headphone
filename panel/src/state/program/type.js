import { ApiRequestActionTypes } from '../../common/utils';

const programTypes = {
	RESET_CURRENT_PROGRAM: 'RESET_CURRENT_PROGRAM',
	GET_PROGRAMS_LIST: new ApiRequestActionTypes('GET_PROGRAMS_LIST'),
	GET_PROGRAM_DETAILS: new ApiRequestActionTypes('GET_PROGRAM_DETAILS'),
	DELETE_PROGRAM: new ApiRequestActionTypes('DELETE_PROGRAM'),
	CREATE_PROGRAM: new ApiRequestActionTypes('CREATE_PROGRAM'),
	UPDATE_PROGRAM_TAGS: new ApiRequestActionTypes('UPDATE_PROGRAM_TAGS'),
	DELETE_PROGRAM_TAGS: new ApiRequestActionTypes('DELETE_PROGRAM_TAGS'),
	UPLOAD_PROGRAM_IMAGE: new ApiRequestActionTypes('UPLOAD_PROGRAM_IMAGE'),
	UPDATE_PROGRAM: new ApiRequestActionTypes('UPDATE_PROGRAM'),
	SEARCH_PROGRAM: new ApiRequestActionTypes('SEARCH_PROGRAM'),
	ENABLE_OR_DISABLE_PROGRAM: new ApiRequestActionTypes('ENABLE_OR_DISABLE_PROGRAM'),
};
export default programTypes;
