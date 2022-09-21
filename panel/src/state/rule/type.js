import { ApiRequestActionTypes } from '../../common/utils';

const ruleTypes = {
	GET_RULE_LIST: new ApiRequestActionTypes('GET_RULE_LIST'),
	CREATE_RULE: new ApiRequestActionTypes('CREATE_RULE'),
	UPDATE_RULE: new ApiRequestActionTypes('UPDATE_RULE'),
	DELETE_RULE: new ApiRequestActionTypes('DELETE_RULE'),
	GET_RULE_DETAILS: new ApiRequestActionTypes('GET_RULE_DETAILS'),
};
export default ruleTypes;
