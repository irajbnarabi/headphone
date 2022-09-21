import './profile.scss';
import Box                            from '@material-ui/core/Box';
import Button                         from '@material-ui/core/Button';
import SwipeableDrawer                from '@material-ui/core/SwipeableDrawer';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import { Icon }                       from '@material-ui/core';
import { ChevronLeft }                from '@material-ui/icons';
import { getProfile, logout }         from '../../../shared/services/user/user-service';
import profileActions                 from '../../../store/actions/profile.action';
import { useHistory }                 from 'react-router-dom';
import PlansDialog                    from '../../../components/dialog/subscription/plans/plans';
import BillDialog                     from '../../../components/dialog/subscription/bill/bill';
import Loading                        from '../../../components/loading/item-loading/loading';
import ErrorHandler                   from '../../../components/error-handler/error-handler';

export default function ProfileContent ({ onClose, isModal = false }) {
	const profile_edit_items                    = [
		{
			title : 'ویرایش اطلاعات حساب کاربری',
			action: 'edit_profile'
		},
		{
			title : 'فهرست سابقه‌ی خرید',
			action: 'purchases'
		},
		{
			title : 'لیست شخصی',
			action: 'favorite'
		},
		{
			title : 'سایر دستگاه‌ها',
			action: 'other_devices'
		},
		{
			title : 'راهنما',
			action: 'guide'
		},
		{
			title : 'پشتیبانی',
			action: 'support'
		}
	];
	const { profile, isLoad }                   = useSelector(state => state.profileData);
	const history                               = useHistory();
	const [state, setState]                     = useState({
		top   : false,
		left  : false,
		bottom: false,
		right : false
	});
	const dispatch                              = useDispatch();
	const [openPlansDialog, setOpenPlansDialog] = useState(false);
	const [openBillDialog, setOpenBillDialog]   = useState(false);
	const [selectedPlan, setSelectedPlan]       = useState(null);
	const [errorHandler, setErrorHandler]       = useState(null);

	useEffect(() => {
		if (!profile) {
			getProfile().then(
				(result) => {
					if (result.status === 200 && result.data.code === 200) {
						dispatch(profileActions(result.data.data));
					}
				}
			).catch(
				(error) => {
					setErrorHandler(error);
				}
			);
		}
	}, [profile, dispatch]);

	if (!isLoad && !errorHandler) return <Loading/>;

	if (!isLoad && errorHandler) return <ErrorHandler error={errorHandler}/>;

	const toggleDrawer = (anchor, open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [ anchor ]: open });
	};

	const logoutUser = () => {
		logout();
		dispatch(profileActions({}));
		if (isModal) {
			onClose();
		} else {
			history.push('/register');
		}
	};

	const list = () => (
		<div role="presentation"
			 onClick={toggleDrawer('bottom', false)}
			 onKeyDown={toggleDrawer('anchor', false)}>
			<Box className="operation-title">
				<span>برای خروج از حساب کاربری خود ، گزینه خروج را انتخاب کنید.</span>
			</Box>
			<Box className="operation-logout">
				<Button onClick={() => logoutUser()}>
					<span>خروج</span>
				</Button>
				<Button onClick={toggleDrawer('bottom', false)}>
					<span>انصراف</span>
				</Button>
			</Box>
		</div>
	);

	const clickOnItems = (action) => {
		if (action === 'edit_profile') {
			history.push('/profile/edit');
		}
		if (action === 'purchases') {
			history.push('/purchases');
		}
		if (action === 'favorite') {
			history.push('/fav-list');
		}
		if (action === 'other_devices') {
			history.push('/sessions');
		}
		if (isModal) {
			onClose();
		}
	};

	const renderOtherOperation = () => {
		return (
			<Box className="other-operation-items">
				{profile_edit_items.map((value, index) => {
					return (
						<Button fullWidth={true}
								onClick={() => {clickOnItems(value.action);}}
								key={index}
								variant={'text'}
								color={'primary'}>
							<span>{value.title}</span>
							<Icon component={ChevronLeft}/>
						</Button>
					);
				})}
				<Button fullWidth={true}
						onClick={toggleDrawer('bottom', true)}
						variant={'text'}
						color={'primary'}>
					<span>خروج از حساب کاربری</span>
					<Icon component={ChevronLeft}/>
				</Button>
			</Box>
		);
	};

	const handleBillDialog = (selectedPlan) => {
		setSelectedPlan(selectedPlan);
		setOpenBillDialog(true);
	};

	const handleReturnBill = () => {
		setOpenBillDialog(false);
		setOpenPlansDialog(true);
	};

	const handleRemainingTimeFromSubscription = () => {
		if (profile.remainedDays === 0) {
			return (
				<>
					<div>اشتراک ندارید</div>
					<Button color={'primary'}
							onClick={() => setOpenPlansDialog(true)}
							fullWidth={true}
							variant={'contained'}>
						<span>خرید اشتراک</span>
					</Button>
				</>
			);
		} else {
			return (
				<>
					<div className="remaining-time-subscription">
						<div className="remaining-days-circle">
							<span>{profile.remainedDays}</span>
							<span> روز </span>
						</div>
						<span className="remaining-days-title">
							<span>از اشتراک شما</span>
							<span>باقی مانده است.</span>
						</span>
					</div>
					<Button color={'primary'}
							onClick={() => setOpenPlansDialog(true)}
							fullWidth={true}
							variant={'contained'}>
						<span>افزایش مدت اشتراک</span>
					</Button>
				</>
			);
		}
	};

	return (
		<Box className="profile-modal">
			<Box className="user-profile-section">
				<Box>
					<div className="user-name">{profile.name}</div>
					<div className="subscription-section">{handleRemainingTimeFromSubscription()}</div>
				</Box>
				{renderOtherOperation()}
				<SwipeableDrawer className="logout-modal"
								 anchor={'bottom'}
								 open={state[ 'bottom' ]}
								 onClose={toggleDrawer('bottom', false)}
								 onOpen={toggleDrawer('bottom', true)}>
					{list('bottom')}
				</SwipeableDrawer>
			</Box>

			<PlansDialog open={openPlansDialog}
						 openBillDialog={handleBillDialog}
						 onClose={() => setOpenPlansDialog(false)}/>
			<BillDialog open={openBillDialog}
						planId={selectedPlan?.id}
						title={selectedPlan?.name}
						onClose={handleReturnBill}/>
		</Box>
	);
}
