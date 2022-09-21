import './profile.scss';
import React, { useEffect } from 'react';
import Box                  from '@material-ui/core/Box';
import ProfileContent       from './profile-content';
import { setTitle }         from '../../../shared/services/general/general-service';

export default function ProfilePage () {
	useEffect(() => {
		setTitle('پروفایل شما در Vidosign');
	}, []);

	return (
		<Box>
			<Box className="profile-bg-image"/>
			<ProfileContent/>
		</Box>
	);
}
