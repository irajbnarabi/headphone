const persians = {
	crew: {
		en: 'crew',
		fa: 'دست‌اندرکاران',
	},
	production_year: {
		fa: 'سال تولید',
		en: 'production-year',
	},
	genre: {
		fa: 'ژانر',
		en: 'genre',
	},
	imdb_rate: {
		fa: 'امتیاز در imdb',
		en: 'imdb-rate',
	},
	pg: {
		fa: 'محدوده سنی',
		en: 'pg',
	},
	time_info: {
		fa: 'مشخصات زمانی',
		en: 'time-info',
	},
	soon: {
		fa: 'به زودی',
		en: 'soon',
	},
};

export const getPersian = (en) => {
	const temp = en.replace('-', '_');
	return persians[temp]?.fa || en;
};
