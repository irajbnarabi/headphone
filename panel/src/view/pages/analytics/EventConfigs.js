const eventTypes = {
	LOGIN: {
		eventName: 'login',
		eventNameFa: 'ورود',
		body: {},
	},
	REGISTER: {
		eventName: 'register',
		eventNameFa: 'ثبت‌نام',
		body: {},
	},
	SUBSCRIBE: {
		eventName: 'subscribe',
		eventNameFa: 'فروش',
		body: {
			id: '',
			programId: '',
			type: '',
		},
	},
	VIEW: {
		eventName: 'view',
		eventNameFa: 'بازدید',
		body: {
			id: '',
			genre: '',
			type: '',
		},
	},
	WATCH: {
		eventName: 'watch',
		eventNameFa: 'تماشا',
		body: {
			id: '',
		},
	},
	SEARCH: {
		eventName: 'search',
		eventNameFa: 'جستجو',
		body: {
			q: '',
		},
	},
	DISCOUNT: {
		eventName: 'discount',
		eventNameFa: 'تخفیف',
		body: {
			voucher: '',
			type: '',
		},
	},
};

const eventConfigs = {
	eventTypes,
};
export default eventConfigs;
