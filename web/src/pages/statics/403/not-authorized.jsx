import './not-authorized.scss';
import React, { useEffect } from 'react';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function NotAuthorized () {
	useEffect(() => {
		setTitle('۴۰۳ | دسترسی غیر مجاز');
	}, []);

	return (
		<div className="not-authorized"/>
	);
}
