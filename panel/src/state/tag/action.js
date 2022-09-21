import { createTagApiCall, deleteTagApiCall, getTagListApiCall, updateTagApiCall, searchTagApiCall } from './api-handler';
import tagTypes from './type';

const getTagList = (pageNumber) => async (dispatch) => {
	dispatch({
		type: tagTypes.GET_TAG_LIST.request,
		payload: { isLoad: false },
	});
	try {
		const response = await getTagListApiCall(pageNumber);
		dispatch({
			type: tagTypes.GET_TAG_LIST.success,
			payload: { tagList: response.data.data, pageCount: response.data.metadata.pageCount, isLoad: true },
		});
	} catch (error) {
		dispatch({
			type: tagTypes.GET_TAG_LIST.failure,
			payload: {},
		});
	}
};

const createTag = (body, page) => async (dispatch) => {
	dispatch({
		type: tagTypes.CREATE_TAG.request,
		payload: {},
	});
	try {
		await createTagApiCall(body);
		dispatch({
			type: tagTypes.CREATE_TAG.success,
			payload: {},
		});
		dispatch(getTagList(page));
	} catch (error) {
		dispatch({
			type: tagTypes.CREATE_TAG.failure,
			payload: {},
		});
	}
};

const updateTag = (body, id, currentPage) => async (dispatch) => {
	dispatch({
		type: tagTypes.UPDATE_TAG.request,
		payload: {},
	});
	try {
		await updateTagApiCall(body, id);
		dispatch({
			type: tagTypes.UPDATE_TAG.success,
			payload: {},
		});
		dispatch(getTagList(currentPage));
	} catch (error) {
		dispatch({
			type: tagTypes.UPDATE_TAG.failure,
			payload: {},
		});
	}
};

const deleteTag = (id, currentPage) => async (dispatch) => {
	dispatch({
		type: tagTypes.DELETE_TAG.request,
		payload: {},
	});
	try {
		await deleteTagApiCall(id);
		dispatch({
			type: tagTypes.DELETE_TAG.success,
			payload: {},
		});
		dispatch(getTagList(currentPage));
	} catch (error) {
		dispatch({
			type: tagTypes.DELETE_TAG.failure,
			payload: {},
		});
	}
};

const searchTag = (query) => async (dispatch) => {
	dispatch({
		type: tagTypes.SEARCH_TAG.request,
		payload: { isLoad: false },
	});
	try {
		const response = await searchTagApiCall(query);
		dispatch({
			type: tagTypes.SEARCH_TAG.success,
			payload: { tagList: response.data.data || [], isLoad: true },
		});
	} catch (error) {
		dispatch({
			type: tagTypes.SEARCH_TAG.failure,
			payload: {},
		});
	}
};

const tagActions = {
	getTagList,
	createTag,
	updateTag,
	deleteTag,
	searchTag,
};
export default tagActions;
