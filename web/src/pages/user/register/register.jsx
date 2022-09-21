import './register.scss';
import React, { useEffect } from 'react';
import RegisterContent      from './register-content';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function RegisterPage () {
	useEffect(() => {
		setTitle('احراز هویت Vidosign');
	}, []);

	return (
		<div dir="rtl">
			<div className="login-bg-pic">
				<div className="layout-bg"/>
			</div>
			<RegisterContent/>
		</div>
	);
}
