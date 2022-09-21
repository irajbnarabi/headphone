const baseUrl = 'http://156.253.5.110:9001/api';
const version = '/v1';
const backendUrl = `${baseUrl}${version}`;

export const getSignUpUserUrl = () => `${backendUrl}/users/register`;
export const getVerifyUserUrl = () => `${backendUrl}/users/verify`;
export const getSignInUserUrl = () => `${backendUrl}/users/authenticate`;
export const getUserCredentialsUrl = () => `${backendUrl}/users/credentials`;

// type = 'movies' or 'series' or 'shows'
export const programListUrl = (type, pageNumber = 1) => `${backendUrl}/admin/headphone/${type}/${pageNumber ? `?page=${pageNumber}` : ''}`;
export const programUrl = (type, id) => `${backendUrl}/admin/headphone/${type}/${id}`;
export const programTagsUrl = (type, id, tagId) => `${backendUrl}/admin/headphone/${type}/${id}/tags/${tagId}`;
export const searchProgramUrl = (type, prefix) => `${backendUrl}/admin/headphone/${type === '' ? `typeless?prefix=${prefix}` : `${type}?prefix=${prefix}`}`;

export const tagDefinitionListUrl = (pageNumber = 1) => `${backendUrl}/admin/tag-definitions/?page=${pageNumber}`;
export const tagDefinitionUrl = (id) => `${backendUrl}/admin/tag-definitions/${id}`;
export const tagDefinitionTagsUrl = (id, prefix) => `${backendUrl}/admin/tag-definitions/${id}/tags/${prefix ? `prefix/${prefix}/` : ''}`;

export const tagListUrl = (pageNumber) => `${backendUrl}/admin/tags/${pageNumber ? `?page=${pageNumber}` : ''}`;
export const tagUrl = (id) => `${backendUrl}/admin/tags/${id}`;
export const searchTagUrl = (prefix, definitionType = 'genre') => `${backendUrl}/admin/tags?prefix=${prefix}`;

export const roleListUrl = (pageNumber = 1) => `${backendUrl}/admin/roles/?page=${pageNumber}`;
export const roleUrl = (id) => `${backendUrl}/admin/roles/${id}`;

export const ruleListUrl = (pageNumber = 1) => `${backendUrl}/admin/rules/?page=${pageNumber}`;
export const ruleUrl = (id) => `${backendUrl}/admin/rules/${id}`;

export const userListUrl = (pageNumber = 1) => `${backendUrl}/admin/users/?page=${pageNumber}`;
export const userUrl = (id) => `${backendUrl}/admin/users/${id}`;
export const userInvoices = (id) => `${backendUrl}/admin/users/${id}/invoices`;
export const searchUserByEmail = (email) => `${backendUrl}/admin/users?email=${email}`;
export const searchUserByMobile = (mobile) => `${backendUrl}/admin/users?mobile=${mobile}`;

export const uploadFileUrl = () => `${backendUrl}/admin/files/upload`;

export const searchUrl = (type, query) => `${backendUrl}/vod/search?types=${type}&q=${query}`;

export const programIsEnableUrl = (id, programType, isEnable) => `${backendUrl}/admin/headphone/${programType}/${id}/${isEnable ? 'enable' : 'disable'}`;

export const videoOfProgramUrl = (programId, programType, videoId = null) => `${backendUrl}/admin/headphone/${programType}/${programId}/videos${videoId ? `/${videoId}` : ''}`;

export const landingsUrl = (type) => `${backendUrl}/admin/home/${type}/config`;

export const plansUrl = (type) => `${backendUrl}/admin/subscriptions/plans${type ? `?type=${type}` : ''}`;
export const searchPlanUrl = (prefix) => `${backendUrl}/admin/subscriptions/plans?prefix=${prefix}`;
export const specificPlanUrl = (id) => `${backendUrl}/admin/subscriptions/plans/${id}`;
export const discountsUrl = () => `${backendUrl}/admin/discounts`;
export const searchDiscountUrl = (prefix) => `${backendUrl}/admin/discounts?prefix=${prefix}`;
export const specificDiscountsUrl = (id) => `${backendUrl}/admin/discounts/${id}`;

export const analyticsUrl = (eventName, from, to) => `${backendUrl}/admin/analytics/${eventName}?${from ? `from=${from}` : ''}${to ? `&to=${to}` : ''}`;
export const analyticsHotUrl = (eventName, from, to, page) => `${backendUrl}/admin/analytics/hot/${eventName}?page=${page}&${from ? `from=${from}` : ''}${to ? `&to=${to}` : ''}`;
