import './aurhentication.scss';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import authenticationActions from '../../../state/authenticate/action';
function SignUpPage() {
	const [principal, setPrincipal] = useState('');
	const dispatch = useDispatch();

	const signUpModal = () => (
		<Dialog classes={{ root: 'authentication-dialog', paper: 'authentication-dialog-paper' }} open>
			<div className='authentication-dialog-title'>
				<b>ثبت نام</b>
				<LockOpenIcon />
			</div>
			<div className='authentication-dialog-content'>
				<TextField label='شماره موبایل' required type='text' variant='outlined' value={principal} onChange={(e) => setPrincipal(e.target.value)} />
			</div>
			<div className='authentication-dialog-action'>
				<Button fullWidth variant='contained' color='primary' onClick={() => dispatch(authenticationActions.signUpUser(principal))}>
					دریافت کد
				</Button>
				<Link to='/login'>
					<div className='authentication-redirect-helper'>قبلا ثبت نام کرده‌اید؟ ورود</div>
				</Link>
			</div>
		</Dialog>
	);
	return <div>{signUpModal()}</div>;
}

export default SignUpPage;
