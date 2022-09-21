import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { discountsUrl, plansUrl, searchDiscountUrl, searchPlanUrl, specificDiscountsUrl, specificPlanUrl } from '../../common/path';

export const getPlansApiCall = (type) => makeGetRequest(plansUrl(type));

export const searchPlansApiCall = (prefix) => makeGetRequest(searchPlanUrl(prefix));

export const createPlanApiCall = (form) => makePostRequest(plansUrl(), form);

export const editPlanApiCall = (id, form) => makePutRequest(specificPlanUrl(id), form);

export const deletePlanApiCall = (id) => makeDeleteRequest(specificPlanUrl(id));

export const getDiscountsApiCall = () => makeGetRequest(discountsUrl());

export const createDiscountApiCall = (form) => makePostRequest(discountsUrl(), form);

export const editDiscountApiCall = (id, form) => makePutRequest(specificDiscountsUrl(id), form);

export const deleteDiscountApiCall = (id) => makeDeleteRequest(specificDiscountsUrl(id));

export const searchDiscountsApiCall = (prefix) => makeGetRequest(searchDiscountUrl(prefix));
