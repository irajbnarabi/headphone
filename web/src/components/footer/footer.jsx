import './footer.scss'
import React from 'react'

export default function Footer() {
	const clickOnEnamad = () =>
		window.open(
			'https://logo.samandehi.ir/Verify.aspx?id=224303&p=uiwkuiwkaodsxlaoobpdxlao',
			'Popup',
			'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30'
		)

	return (
		<footer>
			<div className="footer-container">
				<div className="links" />
				<div className="enamad">
					<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=208197&amp;Code=kxTZh8jmLPIfzjVvKHvV">
						<img
							referrerpolicy="origin"
							src="https://Trustseal.eNamad.ir/logo.aspx?id=208197&amp;Code=kxTZh8jmLPIfzjVvKHvV"
							alt=""
							style={{ cursor: 'pointer' }}
							id="kxTZh8jmLPIfzjVvKHvV"
						/>
					</a>
				</div>
			</div>
		</footer>
	)
}
