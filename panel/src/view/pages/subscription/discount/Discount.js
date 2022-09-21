import './Discount.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton } from '@material-ui/core';
import DiscountModal from './discount-modal/DiscountModal';
import Loading from '../../../components/loading/loading';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import subscriptionActions from '../../../../state/subscription/action';

function Discounts() {
	const { isLoadDiscounts, discounts } = useSelector((state) => state.subscriptionReducer);
	const dispatch = useDispatch();
	const [openDiscountModal, setOpenDiscountModal] = useState(false);
	const [openDeleteDiscountConfModal, setOpenDeleteDiscountConfModal] = useState(false);
	const [actionModeOfModal, setActionModeOfModal] = useState('CREATE');
	const [selectedDiscount, setSelectedDiscount] = useState(null);

	useEffect(() => {
		dispatch(subscriptionActions.getDiscounts());
	}, []);

	const renderForm = () => {
		if (!isLoadDiscounts) return <Loading />;

		if (discounts.length === 0) return <span>در حال حاضر لیست کد تخفیف‌ها خالیست</span>;

		const handleClickOfEditIcon = (discount) => {
			setSelectedDiscount(discount);
			setOpenDiscountModal(true);
			setActionModeOfModal('EDIT');
		};

		return (
			<div className='discounts'>
				{discounts.map((discount, index) => {
					return (
						<Card variant={'outlined'} className='discount-card' key={index}>
							<div>
								<span>کد</span>
								<span> : </span>
								<span>{discount.voucher}</span>
							</div>
							<div>
								<span>بیشینه تخفیف</span>
								<span> : </span>
								<span>{discount.maximum}</span>
							</div>
							<div>
								<span>درصد تخفیف</span>
								<span> : </span>
								<span>{discount.discountPercent}</span>
							</div>
							<div className='discount-operations'>
								<IconButton
									onClick={() => {
										setSelectedDiscount(discount);
										setOpenDeleteDiscountConfModal(true);
									}}
									color={'inherit'}
								>
									<DeleteIcon />
								</IconButton>
								<IconButton onClick={() => handleClickOfEditIcon(discount)} color={'inherit'}>
									<EditIcon />
								</IconButton>
							</div>
						</Card>
					);
				})}
			</div>
		);
	};

	const handleCreateDiscount = () => {
		setSelectedDiscount(null);
		setOpenDiscountModal(true);
		setActionModeOfModal('CREATE');
	};

	const handleAction = (form) => {
		if (actionModeOfModal === 'CREATE') {
			dispatch(subscriptionActions.createDiscount(form));
		} else {
			dispatch(subscriptionActions.editDiscount(selectedDiscount.id, form));
		}
	};

	return (
		<>
			<div className='header-subscription'>
				<h1>کد تخفیف‌ها</h1>
				<Button onClick={handleCreateDiscount} variant={'contained'}>
					<span>اضافه کردن کد تخفیف جدید</span>
				</Button>
			</div>
			{renderForm()}
			<DiscountModal action={handleAction} selectedDiscount={selectedDiscount} actionMode={actionModeOfModal} open={openDiscountModal} onClose={() => setOpenDiscountModal(false)} />
			<ConfirmModal open={openDeleteDiscountConfModal} onClose={() => setOpenDeleteDiscountConfModal(false)} action={() => dispatch(subscriptionActions.deleteDiscount(selectedDiscount.id))} />
		</>
	);
}

export default Discounts;
