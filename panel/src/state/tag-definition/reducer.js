import tagDefinitionTypes from './type';

const initialState = {
	tagDefinitionList: [],
	currentTagDefinition: {},
	tags: [],
	pageCount: 0,
};

const tagDefinitionReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case tagDefinitionTypes.GET_TAG_DEFINITION_LIST.success:
			return {
				...state,
				tagDefinitionList: payload.tagDefinitionList,
				pageCount: payload.pageCount,
			};
		case tagDefinitionTypes.GET_TAG_DEFINITION_DETAIL.success:
			return {
				...state,
				currentTagDefinition: payload.tagDefinition,
			};
		case tagDefinitionTypes.GET_TAG_DEFINITION_TAGS.request:
			return {
				...state,
				tags: [],
			};
		case tagDefinitionTypes.GET_TAG_DEFINITION_TAGS.success:
			return {
				...state,
				tags: payload.tags,
			};
		case tagDefinitionTypes.RETEST_TAGS:
			return {
				...state,
				tags: [],
			};
		default:
			return state;
	}
};
export default tagDefinitionReducer;
