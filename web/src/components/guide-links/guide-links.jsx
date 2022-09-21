import './guide-links.scss';
import { Link }        from 'react-router-dom';
import { Icon }        from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Box             from '@material-ui/core/Box';
import React           from 'react';

function GuideLinks () {
	return (
		<Box className="guides">
			<Link to={'/'}>
				<div>
					<span>راهنما</span>
					<Icon component={ChevronLeftIcon}/>
				</div>
			</Link>
			<Link to={'/'}>
				<div>
					<span>پشتیبانی</span>
					<Icon component={ChevronLeftIcon}/>
				</div>
			</Link>
		</Box>
	);
}

export default GuideLinks;
