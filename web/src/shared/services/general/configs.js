export const serviceConfigs = {
	base_url: 'http://156.253.5.110:9001/api',
	version : '/v1/'
};

export const services_api_names = {
	home_page_data          : 'home/movies',
	series_landings         : 'home/series',
	register                : 'users/register',
	verify                  : 'users/verify',
	credentials             : 'users/credentials',
	authenticate            : 'users/authenticate',
	forget_password         : 'users/credentials/reset',
	profile                 : 'users/profile',
	profile_update_principal: 'users/profile/principal/verify',
	search                  : 'headphone/search/',
	search_intro_movies     : 'headphone/search/intro/movies',
	search_intro_series     : 'headphone/search/intro/series'
};

export const render_type = {
	carousel  : 'CAROUSEL',
	banner    : 'BANNER',
	horizontal: 'HORIZONTAL',
	vertical  : 'VERTICAL'
};

export const render_object_type = {
	movie : 'MOVIE',
	series: 'SERIES',
	tag   : 'TAG',
	media : 'MEDIA'
};

export const variable_names = {
	token             : 'X-USER-TOKEN',
	principal         : 'X-USER-PRINCIPAL',
	user_is_login     : 'X-LOGIN-USER',
	is_forget_password: 'X-FORGET-CREDENTIAL'
};
