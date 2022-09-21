import { ApiRequestActionTypes } from '../../common/utils';

const fileTypes = {
	RESET_FILE: 'RESET_FILE',
	UPLOAD_IMG: new ApiRequestActionTypes('UPLOAD_IMG'),
	UPLOAD_VIDEO: new ApiRequestActionTypes('UPLOAD_VIDEO'),
};
export default fileTypes;
