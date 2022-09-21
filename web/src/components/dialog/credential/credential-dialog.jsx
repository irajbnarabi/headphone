import './credential-dialog.scss';
import Dialog              from '@material-ui/core/Dialog';
import React               from 'react';
import CredentialContent   from '../../../pages/user/credential/credential-content';
import { ModalTransition } from '../../../shared/services/general/general-service';

export default function CredentialDialog ({ onClose, open }) {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose}
				TransitionComponent={ModalTransition}
				classes={{
					root : 'credential-dialog',
					paper: 'credential-dialog-paper'
				}}
				open={open}>
			<CredentialContent onClose={onClose}
							   isModal={true}/>
		</Dialog>
	);
}
