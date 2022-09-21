import './DiscountModal.scss';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, MenuItem, TextField } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const initialForm = {
	discountPercent: '',
	discountType: '',
	enabled: '',
	maximum: '',
	usageType: '',
	voucher: '',
};
const DISCOUNT_TYPES = ['ONE_TIME', 'REGULAR'];
const USAGE_TYPES = ['ONCE_PER_USER', 'MULTIPLE_PER_USER'];

export default function DiscountModal({ open, onClose, actionMode, selectedDiscount, action }) {
	const [form, setFormRaw] = useState(initialForm);
	const [isActive, setIsActive] = useState(false);

	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};

	useEffect(() => {
		if (open) {
			if (actionMode === 'EDIT') {
				setFormRaw({
					discountPercent: selectedDiscount.discountPercent,
					discountType: selectedDiscount.discountType,
					enabled: selectedDiscount.enabled,
					maximum: selectedDiscount.maximum,
					usageType: selectedDiscount.usageType,
					voucher: selectedDiscount.voucher,
				});
				setIsActive(selectedDiscount.enabled);
			} else {
				setIsActive(false);
			}
		} else {
			setFormRaw(initialForm);
		}
	}, [open]);

	const renderForm = () => {
		const handleChangeActivePlan = () => {
			setIsActive((prev) => !prev);
			setForm({ enabled: !isActive });
		};

		const handleSubmit = () => {
			action(form);
			onClose();
		};

		return (
			<form>
				<TextField fullWidth label='voucher' value={form.voucher} onChange={(e) => setForm({ voucher: e.target.value })} variant='outlined' />
				<TextField fullWidth label='درصد تخفیف' value={form.discountPercent} onChange={(e) => setForm({ discountPercent: e.target.value })} variant='outlined' />
				<TextField fullWidth label='بیشینه تخفیف' value={form.maximum} onChange={(e) => setForm({ maximum: e.target.value })} variant='outlined' />
				<TextField id='filled-select-currency' select label='نوع کد' fullWidth value={form.discountType} onChange={(e) => setForm({ discountType: e.target.value })} variant='outlined'>
					{DISCOUNT_TYPES.map((option) => (
						<MenuItem key={option} value={option}>
							<span>{option}</span>
						</MenuItem>
					))}
				</TextField>
				<TextField id='filled-select-currency' select label='نوع استفاده' fullWidth value={form.usageType} onChange={(e) => setForm({ usageType: e.target.value })} variant='outlined'>
					{USAGE_TYPES.map((option) => (
						<MenuItem key={option} value={option}>
							<span>{option}</span>
						</MenuItem>
					))}
				</TextField>
				<FormControlLabel
					className='activate-discount'
					control={<Switch checked={isActive} onChange={handleChangeActivePlan} name='checked' />}
					label={isActive ? 'این کد تخفیف فعال است' : 'این کد تخفیف فعال نیست'}
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
				root: 'discount-modal',
				paper: 'discount-modal-paper',
			}}
		>
			<DialogTitle id='dialog-title'>{actionMode === 'CREATE' ? 'اضافه کردن کد تخفیف' : 'ویرایش کردن کد تخفیف'}</DialogTitle>
			{renderForm()}
		</Dialog>
	);
}
