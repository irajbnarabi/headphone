import GuideLinks                                                  from '../../../components/guide-links/guide-links';
import React, { useState }                                         from 'react';
import { useInput }                                                from '../../../components/custom-hooks/input-hook';
import { Link, useHistory }                                        from 'react-router-dom';
import { credential }                                              from '../../../shared/services/user/user-service';
import { getLocalStorage, removeLocalStorage, updateLocalStorage } from '../../../shared/services/general/general-service';
import { variable_names }                                          from '../../../shared/services/general/configs';
import { ShowToast, toastTypes }                                  from '../../../components/toast/show-tosat';
import Button                                                      from '@material-ui/core/Button';
import Box                                                         from '@material-ui/core/Box';
import { Icon }                                                    from '@material-ui/core';
import ChevronLeftIcon                                             from '@material-ui/icons/ChevronLeft';
import Toast                                                       from '../../../components/toast/toast';
import { useDispatch }                                             from 'react-redux';
import profileActions                                              from '../../../store/actions/profile.action';

export function CredentialForm ({ onClose, isModal }) {
	const { value: name, bind: bindName }                       = useInput('');
	const { value: password, bind: bindPassword }               = useInput('');
	const { value: confirmPassword, bind: bindConfirmPassword } = useInput('');
	const [toastData, setToastData]                             = useState([]);
	const history                                               = useHistory();
	const dispatch                                              = useDispatch();

	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (password === confirmPassword) {
			credential(password, name).then(
				(result) => {
					let response = result.data;
					if (result.status === 200) {
						let token = response.data[ 'token' ];
						updateLocalStorage(variable_names.token, token, true);
						updateLocalStorage(variable_names.user_is_login, true);
						removeLocalStorage(variable_names.is_forget_password);
						if (isModal) {
							onClose();
						} else {
							history.push('/profile');
						}
						dispatch(profileActions({}));
					} else {
						setToastData(ShowToast(toastTypes.error, response.message));
					}
				}
			);
		} else {
			setToastData(ShowToast(toastTypes.error, 'رمز عبور و تکرار رمز عبور با هم مطابفت ندارد'));
		}
	};

	const renderSetCredentialForm = () => {
		return (
			<form autoComplete="off"
				  dir="rtl"
				  onSubmit={handleSubmit}>
				<input {...bindName}
					   type="text"
					   placeholder="نام و نام خانوادگی"/>
				<input {...bindPassword}
					   type="password"
					   placeholder="رمز عبور"/>
				<input {...bindConfirmPassword}
					   type="password"
					   placeholder="تکرار رمز عبور"/>
				<Button variant={'contained'}
						type={'submit'}
						color={'default'}>
					<span>ورود</span>
				</Button>
			</form>
		);
	};

	const renderResetCredentialForm = () => {
		return (
			<form autoComplete="off"
				  dir="rtl"
				  onSubmit={handleSubmit}>
				<input {...bindPassword}
					   type="password"
					   placeholder="رمز عبور"/>
				<input {...bindConfirmPassword}
					   type="password"
					   placeholder="تکرار رمز عبور"/>
				<Button variant={'contained'}
						type={'submit'}
						color={'default'}>
					<span>ورود</span>
				</Button>
			</form>
		);
	};

	const goToRegister = () => {
		if (isModal) {
			onClose();
		}
		removeLocalStorage(variable_names.is_forget_password);
	};

	return (
		<Box className="credential-container">
			<div className="credential-form">
				<h1>IMOVI</h1>
				<div className="message">
					<span>اطلاعات خود را وارد کنید</span>
				</div>
				{getLocalStorage(variable_names.is_forget_password) ? renderResetCredentialForm() : renderSetCredentialForm()}
				<div className="other-operation">
					{isModal ?
						<Button variant={'text'}
								onClick={goToRegister}>
							<span>انصراف</span>
							<Icon component={ChevronLeftIcon}/>
						</Button> :
						<Link to={'/register'}
							  onClick={goToRegister}>
							<span>انصراف</span>
							<Icon component={ChevronLeftIcon}/>
						</Link>}
				</div>
				<Toast toastList={toastData}
					   position={'bottom-right'}
					   autoDelete={true}
					   dismissTime={3000}/>
			</div>
		</Box>
	);
}

export default function CredentialContent ({ onClose, isModal = false }) {
	return (
		<>
			<CredentialForm onClose={onClose}
							isModal={isModal}/>
			<GuideLinks/>
		</>
	);
}
