import './aurhentication.scss';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import authenticationActions from '../../../state/authenticate/action';
function VerifyPage() {
	const [code, setCode] = useState('');
	const dispatch = useDispatch();
	const signUpModal = () => (
		<Dialog classes={{ root: 'authentication-dialog', paper: 'authentication-dialog-paper' }} open>
			<div className='authentication-dialog-title'>
				<b>ورود کد</b>
			</div>
			<div className='authentication-dialog-content'>
				<TextField label='کد ارسالی' required type='text' variant='outlined' value={code} onChange={(e) => setCode(e.target.value)} />
			</div>
			<div className='authentication-dialog-action'>
				<Button fullWidth variant='contained' color='primary' onClick={() => dispatch(authenticationActions.verifyUser(code))}>
					ثبت کد
				</Button>
				<Link to='/signUp'>
					<div className='authentication-redirect-helper'>بازگشت</div>
				</Link>
			</div>
		</Dialog>
	);
	return <div>{signUpModal()}</div>;
}

export default VerifyPage;
