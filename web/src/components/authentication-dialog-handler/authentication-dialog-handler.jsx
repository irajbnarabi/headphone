import './authentication-dialog-handler.scss';
import ProfileDialog       from '../dialog/profile/profile-dialog';
import RegisterDialog      from '../dialog/register/register-dialog';
import AuthenticateDialog  from '../dialog/authenticate/authenticate-dialog';
import VerifyDialog        from '../dialog/verify/verify-dialog';
import CredentialDialog    from '../dialog/credential/credential-dialog';
import React, { useState } from 'react';

export default function AuthenticationDialogHandler ({ openProfileDialog, setOpenProfileDialog, openRegisterDialog, setOpenRegisterDialog }) {
	const [openAuthenticateDialog, setOpenAuthenticateDialog] = useState(false);
	const [openVerifyDialog, setOpenVerifyDialog]             = useState(false);
	const [openCredentialDialog, setOpenCredentialDialog]     = useState(false);

	const handleAuthenticateDialog = (value) => {
		setOpenAuthenticateDialog(value);
	};

	const handleVerifyDialog = (value) => {
		setOpenVerifyDialog(value);
	};

	const handleCredentialDialog = (value) => {
		setOpenCredentialDialog(value);
	};

	return (
		<>
			<ProfileDialog open={openProfileDialog}
						   onClose={() => setOpenProfileDialog(false)}/>
			<RegisterDialog open={openRegisterDialog}
							openAuthenticateDialog={handleAuthenticateDialog}
							openVerifyDialog={handleVerifyDialog}
							onClose={() => setOpenRegisterDialog(false)}/>
			<AuthenticateDialog open={openAuthenticateDialog}
								openVerifyDialog={handleVerifyDialog}
								onClose={handleAuthenticateDialog}/>
			<VerifyDialog onClose={() => setOpenVerifyDialog(false)}
						  openCredentialDialog={handleCredentialDialog}
						  open={openVerifyDialog}/>
			<CredentialDialog onClose={() => setOpenCredentialDialog(false)}
							  open={openCredentialDialog}/>
		</>
	);
}
