import { ApiRequestActionTypes } from '../../common/utils';

const videoTypes = {
	CREATE_VIDEO_OF_PROGRAM: new ApiRequestActionTypes('CREATE_VIDEO_OF_PROGRAM'),
	EDIT_VIDEO_OF_PROGRAM: new ApiRequestActionTypes('EDIT_VIDEO_OF_PROGRAM'),
	DELETE_VIDEO_OF_PROGRAM: new ApiRequestActionTypes('DELETE_VIDEO_OF_PROGRAM'),
};
export default videoTypes;
