import './register-dialog.scss';
import Dialog              from '@material-ui/core/Dialog';
import React               from 'react';
import RegisterContent     from '../../../pages/user/register/register-content';
import { ModalTransition } from '../../../shared/services/general/general-service';

export default function RegisterDialog ({ onClose, open, openAuthenticateDialog, openVerifyDialog }) {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose}
				TransitionComponent={ModalTransition}
				classes={{
					root : 'register-dialog',
					paper: 'register-dialog-paper'
				}}
				open={open}>
			<RegisterContent onClose={handleClose}
							 openVerifyDialog={openVerifyDialog}
							 openAuthenticateDialog={openAuthenticateDialog}
							 isModal={true}/>
		</Dialog>
	);
}
