import { ApiRequestActionTypes } from '../../common/utils';

const tagTypes = {
	GET_TAG_LIST: new ApiRequestActionTypes('GET_TAG_LIST'),
	CREATE_TAG: new ApiRequestActionTypes('CREATE_TAG'),
	UPDATE_TAG: new ApiRequestActionTypes('UPDATE_TAG'),
	DELETE_TAG: new ApiRequestActionTypes('DELETE_TAG'),
	SEARCH_TAG: new ApiRequestActionTypes('SEARCH_TAG'),
};
export default tagTypes;
