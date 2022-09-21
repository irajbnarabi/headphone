import React, { useEffect, useState } from 'react';
import './RoleModal.scss';
import { Button, Dialog, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import roleActions from '../../../../../state/role/action';
import ruleActions from '../../../../../state/rule/action';

function RoleModal({ mode, open, onClose, role }) {
	const [form, setForm] = useState(null);
	const { ruleList } = useSelector((state) => state.ruleReducer);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!ruleList?.length) {
			dispatch(ruleActions.getRuleList());
		}
	}, []);

	useEffect(() => {
		if (open) {
			setForm({ ...role });
		}
	}, [open]);

	const handleSubmit = () => {
		if (mode === 'CREATE') {
			dispatch(roleActions.createRole(form));
		} else {
			dispatch(roleActions.updateRole(form, role.id));
		}
		onClose();
	};

	return (
		<Dialog classes={{ paper: 'role-modal' }} open={open} onClose={onClose}>
			<b>نقش</b>
			<div className='rmm-content'>
				<TextField label='نام' required fullWidth variant='outlined' value={form?.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
				<FormControl fullWidth variant='outlined'>
					<InputLabel>rule(s)</InputLabel>
					<Select value={typeof form?.rules === 'string' ? [form?.rules] : form?.rules || []} onChange={(e) => setForm({ ...form, rules: e.target.value })} label='rule(s)' multiple>
						{ruleList?.map((item) => (
							<MenuItem key={item.id} value={item.id}>
								{item.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className='rmm-action'>
				<Button fullWidth variant='contained' color='primary' onClick={handleSubmit}>
					<span>ثبت</span>
				</Button>
			</div>
		</Dialog>
	);
}

export default RoleModal;
