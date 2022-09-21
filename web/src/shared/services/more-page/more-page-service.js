import { makeFinalRequest, makeGetRequest } from '../general/general-service';

export const getTagMorePages = (tagId, type, page = 1) => {
	const finalRequestUrl = makeFinalRequest(`tags/${tagId}/${type ? type : 'page'}`,
		type ? { page: page } : {});
	return makeGetRequest(finalRequestUrl);
};

export const getProgramMorePages = (programType, programId, page = 1, option) => {
	const finalRequestUrl = makeFinalRequest(`tags/${programId}/${programType}`, {
		page: page
	});
	return makeGetRequest(finalRequestUrl);
};
