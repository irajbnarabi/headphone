import { createMuiTheme } from '@material-ui/core';
import { MainColor }      from './colors';

export default createMuiTheme({
	direction: 'rtl',
	palette  : {
		common    : {
			main: '#FFF'
		},
		primary   : {
			main: MainColor
		},
		secondary : {
			main: '#19857B'
		},
		error     : {
			main: '#F00'
		},
		background: {
			default: '#FFF'
		}
	}
});
