import './Users.scss';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import SingleUser from './SingleUser';
import { useHistory } from 'react-router';
import Loading from '../../../components/loading/loading';
import TextField from '@material-ui/core/TextField';
import userActions from '../../../../state/user/action';

function Users() {
	const { userList, isLoadUsers } = useSelector((state) => state.userReducer);
	const [page] = useState(1);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(userActions.getUserList(page));
	}, []);

	const [searchByEmailVal, setSearchByEmailVal] = useState(null);
	const [searchByEmailElement, setSearchByEmailElement] = useState(null);
	const [searchByPhoneVal, setSearchByPhoneVal] = useState(null);
	const [searchByPhoneElement, setSearchByPhoneElement] = useState(null);

	useEffect(() => {
		clearTimeout(searchByEmailElement);
		if (searchByEmailVal) {
			if (searchByEmailVal.length >= 4) {
				setSearchByEmailElement(
					setTimeout(() => {
						dispatch(userActions.searchUsersByEmail(searchByEmailVal));
					}, 500)
				);
			}
		} else if (searchByEmailVal === '') {
			dispatch(userActions.searchUsersByEmail(searchByEmailVal));
		}
	}, [searchByEmailVal]);

	useEffect(() => {
		clearTimeout(searchByPhoneElement);
		if (searchByPhoneVal) {
			if (searchByPhoneVal.length >= 3) {
				setSearchByPhoneElement(
					setTimeout(() => {
						dispatch(userActions.searchUsersByPhone(searchByPhoneVal));
					}, 500)
				);
			}
		} else if (searchByPhoneVal === '') {
			dispatch(userActions.searchUsersByPhone(searchByPhoneVal));
		}
	}, [searchByPhoneVal]);

	const renderUserSearch = () => {
		return (
			<form>
				<TextField label={'جست‌جو بر اساس ایمیل'} variant={'outlined'} value={searchByEmailVal} onChange={(e) => setSearchByEmailVal(e.target.value)} />
				<TextField label={'جست‌جو بر اساس شماره تلفن'} variant={'outlined'} value={searchByPhoneVal} onChange={(e) => setSearchByPhoneVal(e.target.value)} />
			</form>
		);
	};

	return (
		<Layout>
			<div className='user-list'>
				<div className='user-top-bar'>
					<Button className='ul-button' variant='contained' color='primary' onClick={() => history.push('/users/add')}>
						افزودن
					</Button>
					{renderUserSearch()}
				</div>
				<div className='ul-titles'>
					<div>شناسه</div>
					<div>نام</div>
					<div>موبایل</div>
					<div>نقش(ها)</div>
				</div>
				{!isLoadUsers ? (
					<Loading />
				) : (
					<div className='ul-items'>
						{userList.map((item, index) => (
							<SingleUser key={index} preview={item} />
						))}
					</div>
				)}
			</div>
		</Layout>
	);
}

export default Users;
