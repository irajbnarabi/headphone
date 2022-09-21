import './assets/styles/base.scss'
import './assets/styles/fonts/fonts.scss'
import Header from './components/header/header'
import React from 'react'
import Navigator from './components/mobile-navigator/mobile-navigator'
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from './routes'
// import Footer from './components/footer/footer'

function App() {
	return (
		<main>
			<section id="content-section">
				<Header />
				<section className="main-section">
					<Switch>
						{routes.map((route, index) => {
							return <Route key={index} {...route} />
						})}
						<Redirect to="/404" />
					</Switch>
				</section>
				<Navigator />
				{/*<Footer />*/}
			</section>
		</main>
	)
}

export default App
