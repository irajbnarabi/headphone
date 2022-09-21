import './aurhentication.scss';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import authenticationActions from '../../../state/authenticate/action';
function LoginPage() {
	const [principal, setPrincipal] = useState('');
	const [credential, setCredential] = useState('');
	const dispatch = useDispatch();
	const loginModal = () => (
		<Dialog
			classes={{
				root: 'authentication-dialog',
				paper: 'authentication-dialog-paper',
			}}
			open={true}
		>
			<div className='authentication-dialog-title'>
				<b>ورود</b>
				<LockOpenIcon />
			</div>
			<div className='authentication-dialog-content'>
				<TextField label='شماره موبایل' required type='text' variant='outlined' value={principal} onChange={(e) => setPrincipal(e.target.value)} />
				<TextField label='رمز عبور' required type='password' variant='outlined' value={credential} onChange={(e) => setCredential(e.target.value)} />
			</div>
			<div className='authentication-dialog-action'>
				<Button variant='contained' color='primary' fullWidth onClick={() => dispatch(authenticationActions.signInUser(principal, credential))}>
					<span>ورود</span>
				</Button>
				<Link to='/signUp'>
					<div className='authentication-redirect-helper'>
						<span>ثبت نام نکرده‌اید؟ ثبت نام</span>
					</div>
				</Link>
			</div>
		</Dialog>
	);
	return <div>{loginModal()}</div>;
}

export default LoginPage;
