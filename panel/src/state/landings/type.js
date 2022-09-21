import { ApiRequestActionTypes } from '../../common/utils';

const landingsType = {
	GET_LANDING: new ApiRequestActionTypes('GET_LANDING'),
	UPDATE_LANDING: new ApiRequestActionTypes('UPDATE_LANDING'),
};

export default landingsType;
