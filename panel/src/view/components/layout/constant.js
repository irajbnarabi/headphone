export const pages = {
	HOME: {
		key: 'HOME',
		link: '/',
		title: 'خانه',
	},
	TAG_DEFINITION: {
		key: 'TAG_DEFINITION',
		link: '/tag-definition',
		title: 'مشخصات تگ‌ها',
	},
	TAG: {
		key: 'TAGS',
		link: '/tags',
		title: 'تگ‌ها',
	},
	PROGRAM: {
		key: 'PROGRAM',
		link: '/programs',
		title: 'برنامه',
	},
	SUBSCRIPTION: {
		key: 'SUBSCRIPTION',
		link: '/subscription',
		title: 'مدیریت پرداخت',
	},
	ANALYTICS: {
		key: 'ANALYTICS',
		title: 'آمار',
		children: {
			VIEW: {
				key: 'VIEW',
				link: '/analytics/view',
				title: 'بازدید',
			},
			WATCH: {
				key: 'WATCH',
				link: '/analytics/watch',
				title: 'تماشا',
			},
			SEARCH: {
				key: 'SEARCH',
				link: '/analytics/search',
				title: 'جستجو',
			},
			LOGIN: {
				key: 'LOGIN',
				link: '/analytics/login',
				title: 'ورود',
			},
			REGISTER: {
				key: 'REGISTER',
				link: '/analytics/register',
				title: 'ثبت‌نام',
			},
			SUBSCRIBE: {
				key: 'SUBSCRIBE',
				link: '/analytics/subscribe',
				title: 'فروش',
			},
			DISCOUNT: {
				key: 'DISCOUNT',
				link: '/analytics/discount',
				title: 'تخفیف',
			},
		},
	},
	LANDINGS: {
		key: 'LANDINGS',
		title: 'صفحه‌های اصلی',
		children: {
			MOVIES: {
				key: 'ALBUM',
				link: '/landings/albums',
				title: 'البوم',
			},
			SERIES: {
				key: 'PLAYLIST',
				link: '/landings/playlists',
				title: 'پلی لیست',
			},
		},
	},
	USERS: {
		key: 'USERS',
		title: 'کاربران',
		children: {
			USER: {
				key: 'USER',
				link: '/users',
				title: 'کاربر',
			},
			ROLE: {
				key: 'ROLE',
				link: '/users/roles',
				title: 'نقش‌',
			},
			RULE: {
				key: 'RULE',
				link: '/users/rules',
				title: 'rule',
			},
		},
	},
};
