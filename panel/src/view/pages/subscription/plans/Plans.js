import './Plans.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../components/loading/loading';
import Card from '@material-ui/core/Card';
import { Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PlanModal from './plan-modal/PlanModal';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import subscriptionActions from '../../../../state/subscription/action';

function Plans() {
	const { isLoadPlans, plans } = useSelector((state) => state.subscriptionReducer);
	const dispatch = useDispatch();
	const nf = new Intl.NumberFormat();
	const [openPlanModal, setOpenPlanModal] = useState(false);
	const [openDeletePlanConfModal, setOpenDeletePlanConfModal] = useState(false);
	const [actionModeOfModal, setActionModeOfModal] = useState('CREATE');
	const [selectedPlan, setSelectedPlan] = useState(null);

	useEffect(() => {
		dispatch(subscriptionActions.getPlans());
	}, []);

	const renderPlans = () => {
		if (!isLoadPlans) return <Loading />;

		if (plans.length === 0) return <span>در حال حاضر لیست پلن‌ها خالیست</span>;

		const handleClickOfEditIcon = (plan) => {
			setSelectedPlan(plan);
			setOpenPlanModal(true);
			setActionModeOfModal('EDIT');
		};

		const handleClickOfDeleteIcon = (plan) => {
			setSelectedPlan(plan);
			setOpenDeletePlanConfModal(true);
		};

		return (
			<div className='plans'>
				{plans.map((plan, index) => {
					return (
						<Card variant={'outlined'} className='plan-card' key={index}>
							<div>
								<span>نام</span>
								<span> : </span>
								<span>{plan.name}</span>
							</div>
							<div>
								<span>قیمت</span>
								<span> : </span>
								<span>{nf.format(plan.price)}</span>
							</div>
							<div>
								<span>نوع</span>
								<span> : </span>
								<span>{plan.type}</span>
							</div>
							<div className='plan-operations'>
								<IconButton color={'inherit'} onClick={() => handleClickOfDeleteIcon(plan)}>
									<DeleteIcon />
								</IconButton>
								<IconButton color={'inherit'} onClick={() => handleClickOfEditIcon(plan)}>
									<EditIcon />
								</IconButton>
							</div>
						</Card>
					);
				})}
			</div>
		);
	};

	const handleCreatePlan = () => {
		setSelectedPlan(null);
		setOpenPlanModal(true);
		setActionModeOfModal('CREATE');
	};

	const handleAction = (form) => {
		if (actionModeOfModal === 'CREATE') {
			dispatch(subscriptionActions.createPlan(form));
		} else {
			dispatch(subscriptionActions.editPlan(selectedPlan.id, form));
		}
	};

	return (
		<>
			<div className='header-subscription'>
				<h1>پلن‌ها</h1>
				<Button onClick={handleCreatePlan} variant={'contained'}>
					<span>اضافه کردن پلن جدید</span>
				</Button>
			</div>
			{renderPlans()}
			<PlanModal action={handleAction} selectedPlan={selectedPlan} actionMode={actionModeOfModal} open={openPlanModal} onClose={() => setOpenPlanModal(false)} />
			<ConfirmModal open={openDeletePlanConfModal} onClose={() => setOpenDeletePlanConfModal(false)} action={() => dispatch(subscriptionActions.deletePlan(selectedPlan.id))} />
		</>
	);
}

export default Plans;
