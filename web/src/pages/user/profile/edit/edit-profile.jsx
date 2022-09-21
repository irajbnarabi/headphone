import './edit-profile.scss';
import React, { useEffect, useState }                               from 'react';
import { useDispatch, useSelector }                                 from 'react-redux';
import { getProfile, profileUpdatePrincipal, updateProfileService } from '../../../../shared/services/user/user-service';
import profileActions                                               from '../../../../store/actions/profile.action';
import Button                                                       from '@material-ui/core/Button';
import Loading                                                      from '../../../../components/loading/item-loading/loading';
import SwipeableDrawer                                              from '@material-ui/core/SwipeableDrawer';
import Box                                                          from '@material-ui/core/Box';
import { useInput }                                                 from '../../../../components/custom-hooks/input-hook';
import TextField                                                    from '@material-ui/core/TextField';
import Toast                                                        from '../../../../components/toast/toast';
import { ShowToast, toastTypes }                                    from '../../../../components/toast/show-tosat';
import ErrorHandler                                                 from '../../../../components/error-handler/error-handler';
import { setTitle }                                                 from '../../../../shared/services/general/general-service';

function EditProfilePage () {
	const { profile, isLoad }                                                                 = useSelector(state => state.profileData);
	const dispatch                                                                            = useDispatch();
	const [state, setState]                                                                   = useState({
		top   : false,
		left  : false,
		bottom: false,
		right : false
	});
	const [drawerType, setDrawerType]                                                         = useState('');
	const { value: name, setValue: setName, bind: bindName }                                  = useInput('');
	const { value: email, setValue: setEmail, bind: bindEmail }                               = useInput('');
	const { value: password, setValue: setPassword, bind: bindPassword }                      = useInput('');
	const { value: confirmPassword, bind: bindConfirmPassword }                               = useInput('');
	const { value: verifyEmailCode, setValue: setVerifyEmailCode, bind: bindVerifyEmailCode } = useInput('');
	const [toastData, setToastData]                                                           = useState([]);
	const [errorHandler, setErrorHandler]                                                     = useState(null);

	useEffect(() => {
		setTitle('ویرایش پروفایل Vidosign');
	}, []);

	useEffect(() => {
		if (!profile) {
			getProfile().then(
				(result) => {
					if (result.status === 200 && result.data.code === 200) {
						dispatch(profileActions(result.data.data));
						setName(profile.name ? profile.name : '');
						setEmail(profile.newEmail ? profile.newEmail : (profile.email ? profile.email : ''));
						setPassword(profile.credential ? profile.credential : '');
					}
				}
			).catch(
				(error) => {
					setErrorHandler(error);
				}
			);
		}
	}, [profile, dispatch, setName, setEmail, setPassword]);

	if (!isLoad && !errorHandler) return <Loading/>;

	if (!isLoad && errorHandler) return <ErrorHandler error={errorHandler}/>;

	const handleDrawerOpen = (drawer_type = '') => {
		setState({ ...state, 'bottom': true });
		setDrawerType(drawer_type);
	};

	const handleDrawerClose = () => {
		setState({ ...state, 'bottom': false });
	};

	const updateName = () => {
		updateProfileService(name).then(
			(result) => {
				let response = result.data;
				if (result.status === 200 && response.code === 200) {
					let data = response.data;
					dispatch(profileActions(data));
					handleDrawerClose();
				}
			}
		);
	};

	const editNameDrawer = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			updateName();
		};
		return (
			<Box className="edit-box">
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<TextField id="outlined-name"
							   label="نام و نام خانوادگی"
							   type="text"
							   fullWidth
							   {...bindName}
							   variant="outlined"/>
					<Button variant={'contained'}
							fullWidth={true}
							type={'submit'}
							color={'default'}>
						<span>تغییر نام و نام خانوادگی</span>
					</Button>
				</form>
			</Box>
		);
	};

	const updateEmail = () => {
		updateProfileService('', email).then(
			(result) => {
				let response = result.data;
				if (result.status === 200 && response.code === 200) {
					let data = response.data;
					dispatch(profileActions(data));
					handleDrawerClose();
					handleDrawerOpen('verify-email');
				}
			}
		);
	};

	const editEmailDrawer = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			updateEmail();
		};

		return (
			<Box className="edit-box">
				<form autoComplete="off"
					  onSubmit={handleSubmit}
					  dir="rtl">
					<TextField id="outlined-email"
							   label="ایمیل"
							   type="email"
							   fullWidth
							   {...bindEmail}
							   variant="outlined"/>
					<Button variant={'contained'}
							fullWidth={true}
							type={'submit'}
							color={'default'}>
						<span>تغییر ایمیل</span>
					</Button>
				</form>
			</Box>
		);
	};

	const verifyEmail = () => {
		profileUpdatePrincipal(verifyEmailCode, profile.newEmail, profile.emailUpdateToken).then(
			(result) => {
				if (result.status === 200) {
					profile.email = email;
					dispatch(profileActions(profile));
					setVerifyEmailCode('');
					handleDrawerClose();
				}
			}
		);
	};

	const verifyEmailDrawer = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			verifyEmail();
		};
		return (
			<Box className="edit-box verify-email-box">
				<span className="description">
					<span>به </span>
					<span> {email} </span>
					<span>کد تایید فرستاده شده ، لطفا وارد کنید</span>
				</span>
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<TextField id="outlined-password"
							   label="کد تایید"
							   type="text"
							   fullWidth
							   {...bindVerifyEmailCode}
							   variant="outlined"/>
					<Button variant={'contained'}
							fullWidth={true}
							type={'submit'}
							color={'default'}>
						<span>تایید</span>
					</Button>
				</form>
			</Box>
		);
	};

	const changePassword = () => {
		if (password === confirmPassword) {
			updateProfileService('', '', password).then(
				(result) => {
					let response = result.data;
					if (result.status === 200 && response.code === 200) {
						let data = response.data;
						dispatch(profileActions(data));
						setToastData(ShowToast(toastTypes.error, 'رمز عبور با موفقیت تغییر کرد'));
						setTimeout(() => {
							handleDrawerClose();
						}, 2000);
					}
				}
			);
		} else {
			setToastData(ShowToast(toastTypes.error, 'رمز عبور و تکرار رمز عبور با هم مطابفت ندارد'));
		}
	};

	const editPasswordDrawer = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			changePassword();
		};
		return (
			<Box className="edit-box change-password">
				<form autoComplete="off"
					  dir="rtl"
					  onSubmit={handleSubmit}>
					<TextField id="outlined-password"
							   label="رمزعبور"
							   type="password"
							   fullWidth
							   {...bindPassword}
							   variant="outlined"/>
					<TextField id="outlined-confirm-password"
							   label="تکرار رمزعبور"
							   type="password"
							   fullWidth
							   {...bindConfirmPassword}
							   variant="outlined"/>
					<Button variant={'contained'}
							fullWidth={true}
							type={'submit'}
							color={'default'}>
						<span>تغییر رمزعبور</span>
					</Button>
				</form>
			</Box>
		);
	};

	const renderProfileData = () => {
		return (
			<div className="profile-body">
				<h1>IMOVI</h1>
				<div>
					<h4>ویرایش اطلاعات حساب کاربری</h4>
				</div>
				<Button variant={'outlined'}
						fullWidth
						onClick={() => {handleDrawerOpen('name');}}
						color={'primary'}>
					<span>نام و نام خانوادگی</span>
					<span>{profile.name}</span>
				</Button>
				<Button variant={'outlined'}
						fullWidth
						color={'primary'}>
					<span>شماره همراه</span>
					<span dir="ltr">{profile.mobile}</span>
				</Button>
				<Button variant={'outlined'}
						onClick={() => {handleDrawerOpen('email');}}
						fullWidth
						color={'primary'}>
					<span>ایمیل</span>
					<span>{profile.email}</span>
				</Button>
				<Button variant={'outlined'}
						fullWidth
						onClick={() => {handleDrawerOpen('password');}}
						color={'primary'}>
					<span>رمز عبور</span>
					<span>{profile.credential}</span>
				</Button>
			</div>
		);
	};

	return (
		<div>
			<Box className="edit-profile-bg"/>
			<Box className="edit-profile-container">
				{profile ? renderProfileData() : <Loading/>}
				<SwipeableDrawer className="edit-profile-drawer"
								 anchor={'bottom'}
								 open={state[ 'bottom' ]}
								 onClose={() => {handleDrawerClose(false);}}
								 onOpen={() => {handleDrawerOpen();}}>
					{
						drawerType === 'name' ? editNameDrawer() :
							drawerType === 'email' ? editEmailDrawer() :
								drawerType === 'verify-email' ? verifyEmailDrawer() :
									drawerType === 'password' ? editPasswordDrawer() : ''
					}

					<Toast toastList={toastData}
						   position={'bottom-right'}
						   autoDelete={true}
						   dismissTime={2000}/>
				</SwipeableDrawer>
			</Box>
		</div>
	);
}

export default EditProfilePage;
