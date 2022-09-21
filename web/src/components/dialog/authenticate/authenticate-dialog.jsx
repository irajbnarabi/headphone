import './authenticate-dialog.scss';
import Dialog              from '@material-ui/core/Dialog';
import React               from 'react';
import AuthenticateContent from '../../../pages/user/authenticate/authenticate-content';
import { ModalTransition } from '../../../shared/services/general/general-service';

function AuthenticateDialog ({ onClose, open, openVerifyDialog }) {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose}
				TransitionComponent={ModalTransition}
				classes={{
					root : 'authenticate-dialog',
					paper: 'authenticate-dialog-paper'
				}}
				open={open}>
			<AuthenticateContent onClose={handleClose}
								 openVerifyDialog={openVerifyDialog}
								 isModal={true}/>
		</Dialog>
	);
}

export default AuthenticateDialog;
