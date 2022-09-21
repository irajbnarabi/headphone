import './header.scss';
import React, { useEffect, useState } from 'react';
import ReorderIcon                    from '@material-ui/icons/Reorder';
import { useDispatch, useSelector }   from 'react-redux';
import { useInput }                   from '../custom-hooks/input-hook';
import { Link, useHistory }           from 'react-router-dom';
import { Button }                     from '@material-ui/core';
import { getProfile }                 from '../../shared/services/user/user-service';
import profileActions                 from '../../store/actions/profile.action';
import AuthenticationDialogHandler    from '../authentication-dialog-handler/authentication-dialog-handler';

function Header () {
	const headerMenu                                  = [
		{
			title: 'فیلم',
			url  : '/'
		},
		{
			title: 'سریال',
			url  : '/series'
		},
		//		{
		//			title: 'اکران آنلاین',
		//			url  : '/'
		//		},
		{
			title: 'دسته‌بندی',
			url  : '/search'
		}
	];
	const { profile }                                 = useSelector(state => state.profileData);
	const dispatch                                    = useDispatch();
	const { value: search, bind: bindSearch }         = useInput('');
	const [openProfileDialog, setOpenProfileDialog]   = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const history                                     = useHistory();

	useEffect(() => {
		if (JSON.stringify(profile) === '{}' || !profile) {
			getProfile().then(
				(result) => {
					if (result.status === 200 && result.data.code === 200) {
						let data = result.data.data;
						dispatch(profileActions(data));
					}
				}
			);
		}
	}, [profile, dispatch]);

	const searchBox = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			history.push('/search/' + search);
		};

		return (
			<form autoComplete="off"
				  className="header-search-box"
				  dir="rtl"
				  onSubmit={handleSubmit}>
				<input placeholder="جستجو"
					   {...bindSearch}
					   type="text"
				/>
			</form>
		);
	};

	const profileBox = () => {
		const goToRegister = () => <Button variant={'text'}
										   onClick={() => setOpenRegisterDialog(true)}>
			<span>ورود و ثبت‌نام</span>
		</Button>;

		return (
			<div className="user-name">
				{JSON.stringify(profile) === '{}' || !profile ? goToRegister() : <>
					<Button variant={'text'}
							onClick={() => setOpenProfileDialog(true)}><>
						<div className="more-icon">
							<ReorderIcon/>
						</div>
						{profile?.name}
					</>
					</Button>
				</>}
			</div>
		);
	};

	return (
		<header id="header">
			<div className="right-side-section">
				<Link to={'/'}
					  className="logo">Vidosign</Link>
				<ul>
					{headerMenu.map((value, index) =>
						<li key={index}>
							<Link to={value.url}>
								<span>{value.title}</span>
							</Link>
						</li>
					)}
				</ul>
			</div>
			<div className="left-side-section">
				{profileBox()}
				{searchBox()}
			</div>
			<AuthenticationDialogHandler openProfileDialog={openProfileDialog}
										 setOpenProfileDialog={setOpenProfileDialog}
										 openRegisterDialog={openRegisterDialog}
										 setOpenRegisterDialog={setOpenRegisterDialog}/>
		</header>
	);
}

export default Header;
