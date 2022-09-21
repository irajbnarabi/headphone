import './server-error.scss';
import React, { useEffect } from 'react';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function ServerError () {
	useEffect(() => {
		setTitle('۵۰۰ | خطای سرور');
	}, []);

	return (
		<div className="server-error"/>
	);
}
