import './authenticate.scss';
import React, { useEffect } from 'react';
import AuthenticateContent  from './authenticate-content';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function AuthenticatePage () {
	useEffect(() => {
		setTitle('احراز هویت Vidosign');
	}, []);

	return (
		<div dir="rtl">
			<div className="auth-container"/>
			<AuthenticateContent/>
		</div>
	);
}
