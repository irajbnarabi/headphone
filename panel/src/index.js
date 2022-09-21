import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router';
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import { create } from 'jss';
import rtl from 'jss-rtl';
import RootReducer from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core';
import history from './history';

const rtlTheme = createMuiTheme({ direction: 'rtl' });
const jss = create({
	plugins: [...jssPreset().plugins, rtl()],
});

const Root = () => {
	return (
		<ReduxProvider store={RootReducer}>
			<StylesProvider jss={jss}>
				<ThemeProvider theme={rtlTheme}>
					<Router history={history}>
						<App />
					</Router>
				</ThemeProvider>
			</StylesProvider>
		</ReduxProvider>
	);
};

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.unregister();
