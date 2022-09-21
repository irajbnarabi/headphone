import './PlanModal.scss';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, TextField } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';

const planTypes = ['SUBSCRIPTION', 'TICKET'];
const planTimeUnits = [
	{
		titleFa: 'روز',
		titleEn: 'DAY',
	},
	{
		titleFa: 'ساعت',
		titleEn: 'HOUR',
	},
];

const initialForm = {
	name: '',
	price: '',
	vat: '',
	type: '',
	enabled: '',
	description: '',
	duration: '',
	timeUnit: '',
};

export default function PlanModal({ open, onClose, actionMode, selectedPlan, action }) {
	const [form, setFormRaw] = useState(initialForm);
	const [isActivePlan, setIsActivePlan] = useState(false);

	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};

	useEffect(() => {
		if (open) {
			if (actionMode === 'EDIT') {
				setFormRaw({
					name: selectedPlan.name,
					price: selectedPlan.price,
					vat: selectedPlan.vat,
					enabled: selectedPlan.enabled,
					type: selectedPlan.type,
					description: selectedPlan.description,
					duration: selectedPlan.duration,
					timeUnit: selectedPlan.timeUnit ? selectedPlan.timeUnit : 'DAY',
				});
				setIsActivePlan(selectedPlan.enabled);
			} else {
				setIsActivePlan(false);
			}
		} else {
			setFormRaw(initialForm);
		}
	}, [open]);

	const handleChangeActivePlan = () => {
		setIsActivePlan((prev) => !prev);
		setForm({ enabled: !isActivePlan });
	};

	const handleSubmit = () => {
		action(form);
		onClose();
	};

	const renderForm = () => {
		return (
			<form>
				<TextField fullWidth label='عنوان' value={form.name} onChange={(e) => setForm({ name: e.target.value })} variant='outlined' />
				<TextField fullWidth label='قیمت' type='number' value={form.price} onChange={(e) => setForm({ price: e.target.value })} variant='outlined' />
				<TextField fullWidth label='مالیات (درصد)' type='number' value={form.vat} onChange={(e) => setForm({ vat: e.target.value })} variant='outlined' />
				<TextField id='filled-select-currency' select label='نوع پلن' fullWidth value={form.type} onChange={(e) => setForm({ type: e.target.value })} variant='outlined'>
					{planTypes.map((option) => (
						<MenuItem key={option} value={option}>
							<span>{option}</span>
						</MenuItem>
					))}
				</TextField>
				<div className='plan-time'>
					<TextField fullWidth label='زمان' type='number' value={form.duration} onChange={(e) => setForm({ duration: e.target.value })} variant='outlined' />
					<TextField id='filled-select-currency' select label='واحد زمان' fullWidth value={form.timeUnit} onChange={(e) => setForm({ timeUnit: e.target.value })} variant='outlined'>
						{planTimeUnits.map((option) => (
							<MenuItem key={option} value={option.titleEn}>
								<span>{option.titleFa}</span>
							</MenuItem>
						))}
					</TextField>
				</div>
				<TextField fullWidth multiline={true} label='توضیحات' type='text' value={form.description} onChange={(e) => setForm({ description: e.target.value })} variant='outlined' />
				<FormControlLabel
					className='activate-plan'
					control={<Switch checked={isActivePlan} onChange={handleChangeActivePlan} name='checked' />}
					label={isActivePlan ? 'این پلن فعال است' : 'این پلن فعال نیست'}
				/>
				<Button onClick={handleSubmit} variant={'contained'} color={'primary'}>
					<span>ثبت</span>
				</Button>
			</form>
		);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			classes={{
				root: 'plan-modal',
				paper: 'plan-modal-paper',
			}}
		>
			<DialogTitle id='dialog-title'>{actionMode === 'CREATE' ? 'اضافه کردن پلن' : 'ویرایش کردن پلن'}</DialogTitle>
			{renderForm()}
		</Dialog>
	);
}
