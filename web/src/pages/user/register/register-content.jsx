import './register.scss';
import GuideLinks                from '../../../components/guide-links/guide-links';
import React, { useState }       from 'react';
import { useInput }              from '../../../components/custom-hooks/input-hook';
import { useHistory }            from 'react-router-dom';
import { register }              from '../../../shared/services/user/user-service';
import { setLocalStorage }       from '../../../shared/services/general/general-service';
import { variable_names }        from '../../../shared/services/general/configs';
import { ShowToast, toastTypes } from '../../../components/toast/show-tosat';
import Box                       from '@material-ui/core/Box';
import Button                    from '@material-ui/core/Button';
import Toast                     from '../../../components/toast/toast';

export function LoginForm ({ onClose, isModal, openAuthenticateDialog, openVerifyDialog }) {
	const { value: principal, bind: bindPrincipal } = useInput('');
	const [toastData, setToastData]                 = useState([]);
	const history                                   = useHistory();

	const handleSubmit = (evt) => {
		evt.preventDefault();
		register(principal).then(
			(result) => {
				let response = result.data;
				if (result.status === 200 && response.code === 200) {
					let token = response.data[ 'token' ];
					setLocalStorage(variable_names.principal, principal);
					if (token === '') {
						if (isModal) {
							onClose();
							openAuthenticateDialog(true);
						} else {
							history.push('/authenticate');
						}
					} else {
						setLocalStorage(variable_names.token, token, true);
						if (isModal) {
							onClose();
							openVerifyDialog(true);
						} else {
							history.push('/verify');
						}
					}
				}
			}
		).catch(
			(error) => {
				let response = error.response.data;
				setToastData(ShowToast(toastTypes.error, response.message));
			}
		);
	};

	return (
		<>
			<Box>
				<h1>IMOVI</h1>
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<input {...bindPrincipal}
						   type="tel"
						   placeholder="ایمیل یا شماره تلفن"/>
					<Button variant={'contained'}
							type={'submit'}
							color={'default'}>
						<span>ورود</span>
					</Button>
				</form>
				<Toast toastList={toastData}
					   position={'bottom-right'}
					   autoDelete={false}
					   dismissTime={3000}/>
			</Box>
		</>
	);
}

export default function RegisterContent ({ onClose, isModal = false, openAuthenticateDialog, openVerifyDialog }) {
	return (
		<>
			<div className="login-form">
				<LoginForm onClose={onClose}
						   openAuthenticateDialog={openAuthenticateDialog}
						   openVerifyDialog={openVerifyDialog}
						   isModal={isModal}/>
			</div>
			<GuideLinks/>
		</>
	);
}
