import { makeFinalRequest, makeGetRequest, makePostRequest } from '../general/general-service';

export const getPlans = (type = null) => {
	const finalRequestUrl = makeFinalRequest(`subscriptions/plans${type ? `?type=${type}` : ''}`);
	return makeGetRequest(finalRequestUrl);
};

export const getPlan = (planId) => {
	const finalRequestUrl = makeFinalRequest(`subscriptions/plans/${planId}/calc`);
	return makeGetRequest(finalRequestUrl);
};

export const getIpgs = () => {
	const finalRequestUrl = makeFinalRequest(`payment/ipgs`);
	return makeGetRequest(finalRequestUrl);
};

export const submitDiscount = (planId, discount) => {
	const finaRequestUrl = makeFinalRequest(`discounts/verify`);
	return makePostRequest(finaRequestUrl, {
		planId  : planId,
		discount: discount
	});
};

export const subscribe = (planId, ipgId, discount, programId = null) => {
	const finaRequestUrl = makeFinalRequest(`users/subscribe`);
	return makePostRequest(finaRequestUrl, {
		planId   : planId,
		ipgId    : Number(ipgId),
		discount : discount,
		programId: programId
	});
};

export const getInvoice = (id) => {
	const finalRequestUrl = makeFinalRequest(`users/invoices/${id}`);
	return makeGetRequest(finalRequestUrl);
};

export const getInvoices = () => {
	const finalRequestUrl = makeFinalRequest(`users/invoices`);
	return makeGetRequest(finalRequestUrl);
};
