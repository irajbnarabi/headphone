import './aurhentication.scss';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import authenticationActions from '../../../state/authenticate/action';
function CredentialPage() {
	const [credential, setCredential] = useState('');
	const [credentialConfirm, setCredentialConfirm] = useState('');
	const dispatch = useDispatch();
	const signUpModal = () => (
		<Dialog classes={{ root: 'authentication-dialog', paper: 'authentication-dialog-paper' }} open={true}>
			<div className='authentication-dialog-title'>
				<b>ثبت رمز عبور</b>
			</div>
			<div className='authentication-dialog-content'>
				<TextField label='رمز عبور' required type='password' variant='outlined' value={credential} onChange={(e) => setCredential(e.target.value)} />
				<TextField label='تکرار رمز عبور' required type='password' variant='outlined' value={credentialConfirm} onChange={(e) => setCredentialConfirm(e.target.value)} />
			</div>
			<div className='authentication-dialog-action'>
				<Button
					fullWidth
					disabled={credentialConfirm !== credential || !credential}
					variant='contained'
					color='primary'
					onClick={() => dispatch(authenticationActions.userCredentials(credential))}
				>
					ثبت رمز عبور
				</Button>
				<Link to='/verify'>
					<div className='authentication-redirect-helper'>بازگشت</div>
				</Link>
			</div>
		</Dialog>
	);
	return <div>{signUpModal()}</div>;
}

export default CredentialPage;
