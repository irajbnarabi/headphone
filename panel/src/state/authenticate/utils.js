export function getLoginInfo() {
	const loginInfo = localStorage.getItem('loginInfo');
	const loginInfoStr = loginInfo && JSON.parse(loginInfo);
	return loginInfoStr?.token && loginInfoStr?.principal ? loginInfoStr : null;
}
