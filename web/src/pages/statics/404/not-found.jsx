import './not-found.scss';
import React, { useEffect } from 'react';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function NotFound () {
	useEffect(() => {
		setTitle('۴۰۴ | صفحه مورد نظر یافت نشد');
	}, []);

	return (
		<div className="not-found"/>
	);
}
