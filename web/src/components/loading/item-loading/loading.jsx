import './loading.scss';
import React from 'react';

function Loading ({ forceHeight = true }) {
	return (
		<div className="loading-spinner"
			 style={{ height: forceHeight ? 'calc(100vh - 60px)' : '' }}>
			<div className="lds-ellipsis">
				<div/>
				<div/>
				<div/>
				<div/>
			</div>
		</div>
	);
}

export default Loading;
