import { ApiRequestActionTypes } from '../../common/utils';

const roleTypes = {
	GET_ROLE_LIST: new ApiRequestActionTypes('GET_ROLE_LIST'),
	CREATE_ROLE: new ApiRequestActionTypes('CREATE_ROLE'),
	UPDATE_ROLE: new ApiRequestActionTypes('UPDATE_ROLE'),
	DELETE_ROLE: new ApiRequestActionTypes('DELETE_ROLE'),
	GET_ROLE_DETAILS: new ApiRequestActionTypes('GET_ROLE_DETAILS'),
};
export default roleTypes;
