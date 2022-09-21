import './first-view-loading.scss';
import React from 'react';

function FirstViewLoading () {
	return (
		<div id="first-view-pre-loading">
			<div className="lds-ripple">
				<div/>
				<div/>
			</div>
		</div>
	);
}

export default FirstViewLoading;
