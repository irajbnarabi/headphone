import './verify.scss';
import React, { useEffect } from 'react';
import VerifyContent        from './verify-content';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function VerifyPage () {
	useEffect(() => {
		setTitle('احراز هویت Vidosign');
	}, []);

	return (
		<div dir="rtl">
			<div className="verify-bg"/>
			<VerifyContent/>
		</div>
	);
}
