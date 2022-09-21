import { ApiRequestActionTypes } from '../../common/utils';

const tagDefinitionTypes = {
	RETEST_TAGS: 'RETEST_TAGS',
	GET_TAG_DEFINITION_LIST: new ApiRequestActionTypes('GET_TAG_DEFINITION_LIST'),
	CREATE_TAG_DEFINITION: new ApiRequestActionTypes('CREATE_TAG_DEFINITION'),
	GET_TAG_DEFINITION_DETAIL: new ApiRequestActionTypes('GET_TAG_DEFINITION_DETAIL'),
	UPDATE_TAG_DEFINITION: new ApiRequestActionTypes('UPDATE_TAG_DEFINITION'),
	DELETE_TAG_DEFINITION: new ApiRequestActionTypes('DELETE_TAG_DEFINITION'),
	GET_TAG_DEFINITION_TAGS: new ApiRequestActionTypes('GET_TAG_DEFINITION_TAGS'),
};
export default tagDefinitionTypes;
