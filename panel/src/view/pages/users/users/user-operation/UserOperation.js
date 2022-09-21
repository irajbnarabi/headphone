import './UserOperation.scss';
import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import roleActions from '../../../../../state/role/action';
import userActions from '../../../../../state/user/action';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import UserInvoices from './UserInvoices';
import Loading from '../../../../components/loading/loading';

const initialForm = {
	email: '',
	mobile: '',
	name: '',
	roles: [],
};

function UserOperation(props) {
	const [form, setFormRaw] = useState(initialForm);
	const [userId, setUserId] = useState(null);
	const { currentUser, invoices, isLoadUsers, isLoadInvoices } = useSelector((state) => state.userReducer);
	const { roleList } = useSelector((state) => state.roleReducer);
	const dispatch = useDispatch();

	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};

	useEffect(() => {
		dispatch(roleActions.getRoleList());
		if (props.match.params.id) {
			setUserId(props.match.params.id);
		}
	}, [props]);

	useEffect(() => {
		if (userId) {
			dispatch(userActions.getUserDetail(userId));
			dispatch(userActions.getUserInvoices(userId));
		}
	}, [userId]);

	useEffect(() => {
		if (userId && currentUser) {
			setFormRaw({
				name: currentUser.name,
				mobile: currentUser.mobile,
				email: currentUser.email,
				roles: currentUser.roles,
			});
		} else {
			setForm(initialForm);
		}
	}, [currentUser, userId]);

	const handleSubmit = () => {
		if (!userId) {
			dispatch(userActions.createUser(form));
		} else {
			dispatch(userActions.updateUser(form, userId));
		}
	};

	const renderData = () => {
		return (
			<Box style={{ display: 'block', width: '100%' }}>
				<h2>کاربر</h2>
				<div className='user-container'>
					<div className='user-operation'>
						<h3>اطلاعات کاربر</h3>
						<div className='umm-content'>
							<TextField label='نام' required fullWidth variant='outlined' value={form?.name || ''} onChange={(e) => setForm({ name: e.target.value })} />
							<TextField label='ایمیل' required fullWidth variant='outlined' value={form?.email || ''} onChange={(e) => setForm({ email: e.target.value })} />
							<TextField label='موبایل' required fullWidth variant='outlined' value={form?.mobile || ''} onChange={(e) => setForm({ mobile: e.target.value })} />
							<FormControl fullWidth variant='outlined'>
								<InputLabel>نقش(ها)</InputLabel>
								<Select
									value={form?.roles || []}
									renderValue={(selected) => (selected ? selected.join(',') : '')}
									onChange={(e) => setForm({ roles: e.target.value })}
									label='نقش(ها)'
									multiple
								>
									{roleList?.map((item) => (
										<MenuItem key={item.name} value={item.name}>
											<span>{item.name}</span>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
						<div className='umm-action'>
							<Button fullWidth variant='contained' color='primary' onClick={handleSubmit}>
								<span>ثبت</span>
							</Button>
						</div>
					</div>
					<UserInvoices invoices={invoices} isLoadInvoices={isLoadInvoices} isShowInvoices={userId && userId.length} />
				</div>
			</Box>
		);
	};

	return <Layout>{userId ? !isLoadUsers ? <Loading /> : renderData() : renderData()}</Layout>;
}

export default UserOperation;
