import './credential.scss';
import React, { useEffect } from 'react';
import CredentialContent    from './credential-content';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function CredentialPage () {
	useEffect(() => {
		setTitle('احراز هویت Vidosign');
	}, []);

	return (
		<div dir="rtl">
			<div className="credential-bg"/>
			<CredentialContent/>
		</div>
	);
}
