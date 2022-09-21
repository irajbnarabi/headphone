import './verify.scss';
import GuideLinks                              from '../../../components/guide-links/guide-links';
import React, { useState }                     from 'react';
import { useInput }                            from '../../../components/custom-hooks/input-hook';
import { Link, useHistory }                    from 'react-router-dom';
import { register, verify }                    from '../../../shared/services/user/user-service';
import { getLocalStorage, updateLocalStorage } from '../../../shared/services/general/general-service';
import { variable_names }                      from '../../../shared/services/general/configs';
import { ShowToast, toastTypes }               from '../../../components/toast/show-tosat';
import Box                                     from '@material-ui/core/Box';
import Countdown                               from '../../../components/countdown/countdown';
import Button                                  from '@material-ui/core/Button';
import { Icon }                                from '@material-ui/core';
import ChevronLeftIcon                         from '@material-ui/icons/ChevronLeft';
import Toast                                   from '../../../components/toast/toast';

export function VerifyForm ({ onClose, isModal, openCredentialDialog }) {
	const { value: code, bind: bindCode } = useInput('');
	const [toastData, setToastData]       = useState([]);
	const history                         = useHistory();

	const handleSubmit = (evt) => {
		evt.preventDefault();
		verify(code, getLocalStorage(variable_names.principal), getLocalStorage(variable_names.token, true)).then(
			(result) => {
				let response = result.data;
				if (result.status === 200 && response.code === 200) {
					let token = response.data[ 'token' ];
					updateLocalStorage(variable_names.token, token, true);
					if (isModal) {
						onClose();
						openCredentialDialog(true);
					} else {
						history.push('/credential');
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

	const resendCode = () => {
		return register(getLocalStorage(variable_names.principal));
	};

	return (
		<Box className="verify-container">
			<div className="verify-form">
				<h1>IMOVI</h1>
				<div className="message">
					<span>کد تایید به</span>
					<span className="phone">{getLocalStorage(variable_names.principal)}</span>
					<span>ارسال شد.</span>
				</div>
				<div className="countdown">
					<Countdown initialTime={120}
							   resetFunc={resendCode}/>
				</div>
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<input placeholder="کد تایید"
						   type="text"
						   {...bindCode}/>
					<Button variant={'contained'}
							type={'submit'}
							color={'default'}>
						<span>تایید</span>
					</Button>
				</form>
				<Box className="other-operation">
					<div>
						{isModal ?
							<Button variant={'text'}
									onClick={() => onClose()}>
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
					   autoDelete={false}
					   dismissTime={3000}/>
			</div>
		</Box>
	);
}

export default function VerifyContent ({ onClose, isModal = false, openCredentialDialog }) {
	return (
		<>
			<VerifyForm onClose={onClose}
						openCredentialDialog={openCredentialDialog}
						isModal={isModal}/>
			<GuideLinks/>
		</>
	);
}
