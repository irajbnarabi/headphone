module.exports = {
	env: {
		browser: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:jsx-a11y/recommended', 'react-app', 'google', 'prettier', 'prettier/react'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		'prettier/prettier': 0,
		'require-jsdoc': 0,
		'react/jsx-key': [1, { checkFragmentShorthand: true }],
		// 'max-len': [
		// 	'error',
		// 	{
		// 		code: 220,
		// 	},
		// ],
		// 'no-unused-vars': 'off',
		// 'no-fallthrough': 'off',
		// 'no-mixed-spaces-and-tabs': 'off',
		// 'no-tabs': 'off',
		// 'object-curly-spacing': 'off',
		// 'jsx-a11y/media-has-caption': 'off',
		// 'comma-dangle': 'off',
		// quotes: 'off',
		// 'operator-linebreak': 'off',
		'react/prop-types': 0,
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
	},
};
