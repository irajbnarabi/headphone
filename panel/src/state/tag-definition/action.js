import {
	createTagDefinitionApiCall,
	deleteTagDefinitionApiCall,
	getTagDefinitionDetailApiCall,
	getTagDefinitionListApiCall,
	getTagDefinitionTagsApiCall,
	updateTagDefinitionApiCall,
} from './api-handler';
import tagDefinitionTypes from './type';

const getTagDefinitionList = (pageNumber) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.GET_TAG_DEFINITION_LIST.request,
		payload: {},
	});
	try {
		const response = await getTagDefinitionListApiCall(pageNumber);
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_LIST.success,
			payload: { tagDefinitionList: response.data.data, pageCount: response.data.metadata.pageCount },
		});
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_LIST.failure,
			payload: {},
		});
	}
};

const createTagDefinition = (body) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.CREATE_TAG_DEFINITION.request,
		payload: {},
	});
	try {
		await createTagDefinitionApiCall(body);
		dispatch({
			type: tagDefinitionTypes.CREATE_TAG_DEFINITION.success,
			payload: {},
		});
		dispatch(getTagDefinitionList());
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.CREATE_TAG_DEFINITION.failure,
			payload: {},
		});
	}
};

const getTagDefinitionDetail = (id) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.GET_TAG_DEFINITION_DETAIL.request,
		payload: {},
	});
	try {
		const response = await getTagDefinitionDetailApiCall(id);
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_DETAIL.success,
			payload: { tagDefinition: response.data.data },
		});
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_DETAIL.failure,
			payload: {},
		});
	}
};

const updateTagDefinition = (id, body, currentPage = 1) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.UPDATE_TAG_DEFINITION.request,
		payload: {},
	});
	try {
		await updateTagDefinitionApiCall(id, body);
		dispatch({
			type: tagDefinitionTypes.UPDATE_TAG_DEFINITION.success,
			payload: {},
		});
		dispatch(getTagDefinitionList(currentPage));
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.UPDATE_TAG_DEFINITION.failure,
			payload: {},
		});
	}
};

const deleteTagDefinition = (id, currentPage = 1) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.DELETE_TAG_DEFINITION.request,
		payload: {},
	});
	try {
		await deleteTagDefinitionApiCall(id);
		dispatch({
			type: tagDefinitionTypes.DELETE_TAG_DEFINITION.success,
			payload: {},
		});
		dispatch(getTagDefinitionList(currentPage));
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.DELETE_TAG_DEFINITION.failure,
			payload: {},
		});
	}
};

const getTagDefinitionTags = (id, prefix) => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.GET_TAG_DEFINITION_TAGS.request,
		payload: {},
	});
	try {
		const response = await getTagDefinitionTagsApiCall(id, prefix);
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_TAGS.success,
			payload: { tags: response.data.data },
		});
	} catch (error) {
		dispatch({
			type: tagDefinitionTypes.GET_TAG_DEFINITION_TAGS.failure,
			payload: {},
		});
	}
};

const resetTags = () => async (dispatch) => {
	dispatch({
		type: tagDefinitionTypes.RETEST_TAGS,
		payload: {},
	});
};

const tagDefinitionActions = {
	getTagDefinitionList,
	createTagDefinition,
	getTagDefinitionDetail,
	updateTagDefinition,
	deleteTagDefinition,
	getTagDefinitionTags,
	resetTags,
};
export default tagDefinitionActions;
