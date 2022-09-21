import './plans.scss';
import Dialog                         from '@material-ui/core/Dialog';
import React, { useEffect, useState } from 'react';
import { useSelector }                from 'react-redux';
import { getPlans }                   from '../../../../shared/services/user/subscription-service';
import { IconButton }                 from '@material-ui/core';
import CloseIcon                      from '@material-ui/icons/Close';
import Loading                        from '../../../loading/item-loading/loading';
import Button                         from '@material-ui/core/Button';
import { ModalTransition }            from '../../../../shared/services/general/general-service';

export default function PlansDialog ({ open, onClose, openBillDialog }) {
	const { profile }       = useSelector(state => state.profileData);
	const [plans, setPlans] = useState(null);
	const nf                = new Intl.NumberFormat();

	useEffect(() => {
		if (open) {
			getPlans('subscription').then(
				(res) => {
					if (res.status === 200 && res.data.code === 200) {
						setPlans(res.data.data);
					}
				}
			);
		}
	}, [open]);

	const handleClickOnPlan = (plan) => {
		openBillDialog(plan);
		onClose();
	};

	const renderPlans = () => plans.map((plan, index) => (
		<Button key={index}
				onClick={() => handleClickOnPlan(plan)}
				className={`plan-color plan-color__${index % 3}`}>
			<span>{plan?.name}</span>
			<span className="price">
				(
				<span>{nf.format(plan?.price)}</span>
				<span>تومان</span>
				)
			</span>
		</Button>
	));

	return (
		<Dialog fullScreen={window.innerWidth < 980}
				classes={{
					root : 'plans-dialog',
					paper: window.innerWidth < 980 ? '' : 'plans-dialog-paper'
				}}
				open={open}
				onClose={onClose}
				TransitionComponent={ModalTransition}>
			<IconButton className="close-modal-btn"
						onClick={onClose}>
				<CloseIcon/>
			</IconButton>
			<h3>{profile?.name}</h3>
			<h2>IMOVI</h2>
			<h3>خرید اشتراک</h3>
			<small>۹٪ مالیات بر ارزش افزوده به خرید شما اضافه می‌شود.</small>
			<div style={{ marginTop: '8px' }}>
				{plans ? renderPlans() : <Loading forceHeight={false}/>}
			</div>
			<p>شما با داشتن اشتراک موویست به امکانات زیر دسترسی دارید:
			   ترافیک اینترنت به صورت نیم‌بها، برای تماشا یا دانلود فیلم در فیلیمو، روی همه اپراتورها هزاران ساعت فیلم و سریال ایرانی و خارجی به صورت دوبله یا با زیرنویس امکان
			   دانلود فیلم به صورت درون برنامه‌ای، برای تماشای آفلاین و زمانی که اینترنت ندارید. تماشای فیلم‌، به صورت هم‌زمان از ۳ دستگاه (تلویزیون، کامپیوتر، گوشی یا تبلت).</p>
		</Dialog>
	);
}
