import './profile-dialog.scss';
import Dialog         from '@material-ui/core/Dialog';
import React          from 'react';
import ProfileContent from '../../../pages/user/profile/profile-content';

export default function ProfileDialog ({ onClose, open }) {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose}
				classes={{
					root : 'profile-dialog',
					paper: 'profile-dialog-paper'
				}}
				aria-labelledby="simple-dialog-title"
				open={open}>
			<ProfileContent onClose={handleClose}
							isModal={true}/>
		</Dialog>
	);
}
