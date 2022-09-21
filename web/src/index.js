import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './assets/styles/theme';
import StylesProvider from '@material-ui/styles/StylesProvider';
import { jssPreset } from '@material-ui/styles';
import rtl from 'jss-rtl';
import { create } from 'jss';
import ScrollToTop from './shared/services/general/scroll-to-top';

function Main() {
	const store = configureStore();
	const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

	useEffect(() => {
		//		const jssStyles = document.querySelector('#jss-server-side');
		//		if (jssStyles) {
		//			jssStyles.parentElement.removeChild(jssStyles);
		//		}
	}, []);

	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<StylesProvider jss={jss}>
					<BrowserRouter>
						<ScrollToTop>
							<App />
						</ScrollToTop>
					</BrowserRouter>
				</StylesProvider>
			</ThemeProvider>
		</Provider>
	);
}

ReactDOM.render(<Main />, document.getElementById('root'));
