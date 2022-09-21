import './authenticate.scss';
import GuideLinks                                               from '../../../components/guide-links/guide-links';
import React, { useState }                                      from 'react';
import { useInput }                                             from '../../../components/custom-hooks/input-hook';
import { Link, useHistory }                                     from 'react-router-dom';
import { authenticate, resetCredential }                        from '../../../shared/services/user/user-service';
import { getLocalStorage, setLocalStorage, updateLocalStorage } from '../../../shared/services/general/general-service';
import { variable_names }                                       from '../../../shared/services/general/configs';
import { ShowToast, toastTypes }                                from '../../../components/toast/show-tosat';
import Box                                                      from '@material-ui/core/Box';
import Button                                                   from '@material-ui/core/Button';
import { Icon }                                                 from '@material-ui/core';
import ChevronLeftIcon                                          from '@material-ui/icons/ChevronLeft';
import Toast                                                    from '../../../components/toast/toast';
import { useDispatch }                                          from 'react-redux';
import profileActions                                           from '../../../store/actions/profile.action';

export function AuthForm ({ onClose, isModal, openVerifyDialog }) {
	const { value: password, bind: bindPassword } = useInput('');
	const [toastData, setToastData]               = useState([]);
	const history                                 = useHistory();
	const dispatch                                = useDispatch();

	const handleSubmit = (evt) => {
		evt.preventDefault();
		authenticate(getLocalStorage(variable_names.principal), password).then(
			(result) => {
				const response = result.data;
				if (result.status === 200 && response.code === 200) {
					let token = response.data[ 'token' ];
					updateLocalStorage(variable_names.token, token, true);
					updateLocalStorage(variable_names.user_is_login, true);
					setToastData(ShowToast(toastTypes.error, response.message));
					setTimeout(() => {
						if (isModal) {
							onClose();
						} else {
							history.push('/profile');
						}
						dispatch(profileActions({}));
					}, 1500);
				}
			}
		).catch(
			(error) => {
				let response = error.response.data;
				setToastData(ShowToast(toastTypes.error, response.message));
			}
		);
	};

	const forgetPassword = () => {
		resetCredential(getLocalStorage(variable_names.principal)).then(
			(result) => {
				const response = result.data;
				if (result.status === 200 && response.code === 200) {
					let token = response.data[ 'token' ];
					updateLocalStorage(variable_names.token, token, true);
					setLocalStorage(variable_names.is_forget_password, true);
					if (isModal) {
						onClose();
						openVerifyDialog(true);
					} else {
						history.push('/verify');
					}
				} else {
					setToastData(ShowToast(toastTypes.error, response.message));
				}
			}
		);
	};

	return (
		<Box className="auth">
			<div className="auth-form">
				<h1>IMOVI</h1>
				<div className="phone-show">
					<span>{getLocalStorage(variable_names.principal)}</span>
				</div>
				<div className="message">
					<span>رمز عبور خود را وارد کنید.</span>
				</div>
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<input {...bindPassword}
						   type="password"
						   placeholder="رمز عبور"/>
					<Button variant={'contained'}
							type={'submit'}
							color={'default'}>
						<span>ورود</span>
					</Button>
				</form>
				<Box className="other-operation">
					<div>
						<button className="forget-password"
								onClick={forgetPassword}>
							<span>رمز عبور را فراموش کرده‌ام</span>
							<Icon component={ChevronLeftIcon}/>
						</button>
					</div>
					<div>
						{isModal ?
							<Button onClick={onClose}>
								<span>انصراف</span>
								<Icon component={ChevronLeftIcon}/>
							</Button> :
							<Link to={'/register'}>
								<span>انصراف</span>
								<Icon component={ChevronLeftIcon}/>
							</Link>}
					</div>
				</Box>
				<Toast toastList={toastData}
					   position={'bottom-right'}
					   autoDelete={true}
					   dismissTime={3000}/>
			</div>
		</Box>
	);
}

export default function AuthenticateContent ({ onClose, isModal = false, openVerifyDialog }) {
	return (
		<>
			<AuthForm onClose={onClose}
					  openVerifyDialog={openVerifyDialog}
					  isModal={isModal}/>
			<GuideLinks/>
		</>
	);
}

