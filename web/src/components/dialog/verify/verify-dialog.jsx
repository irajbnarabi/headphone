import './verify-dialog.scss';
import Dialog              from '@material-ui/core/Dialog';
import React               from 'react';
import VerifyContent       from '../../../pages/user/verify/verify-content';
import { ModalTransition } from '../../../shared/services/general/general-service';

export default function VerifyDialog ({ onClose, open, openCredentialDialog }) {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose}
				TransitionComponent={ModalTransition}
				classes={{
					root : 'verify-dialog',
					paper: 'verify-dialog-paper'
				}}
				open={open}>
			<VerifyContent isModal={true}
						   openCredentialDialog={openCredentialDialog}
						   onClose={onClose}/>
		</Dialog>
	);
}
