import { uploadImageApiCall, uploadVideoApiCall } from './api-handler';
import fileTypes from './type';

const uploadImage = (body, id) => async (dispatch) => {
	dispatch({
		type: fileTypes.UPLOAD_IMG.request,
		payload: { id },
	});
	try {
		const formData = new FormData();
		for (const key in body) {
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				formData.append(key, body[key]);
			}
		}
		const response = await uploadImageApiCall(formData);
		dispatch({
			type: fileTypes.UPLOAD_IMG.success,
			payload: { file: response.data, id },
		});
	} catch (error) {
		dispatch({
			type: fileTypes.UPLOAD_IMG.failure,
			payload: { id },
		});
	}
};

const uploadVideo = (body, id) => async (dispatch) => {
	dispatch({
		type: fileTypes.UPLOAD_VIDEO.request,
		payload: { id },
	});
	try {
		const formData = new FormData();
		for (const key in body) {
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				formData.append(key, body[key]);
			}
		}
		const response = await uploadVideoApiCall(formData);
		dispatch({
			type: fileTypes.UPLOAD_VIDEO.success,
			payload: { file: response.data, id },
		});
	} catch (error) {
		dispatch({
			type: fileTypes.UPLOAD_VIDEO.failure,
			payload: { id },
		});
	}
};

const resetFile = (id) => ({
	type: fileTypes.RESET_FILE,
	payload: { id },
});

const fileActions = {
	uploadImage,
	uploadVideo,
	resetFile,
};

export default fileActions;
