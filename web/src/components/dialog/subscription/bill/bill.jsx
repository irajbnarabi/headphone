import './bill.scss';
import Dialog                                          from '@material-ui/core/Dialog';
import React, { useEffect, useState }                  from 'react';
import { IconButton }                                  from '@material-ui/core';
import { ArrowBack }                                   from '@material-ui/icons';
import { useInput }                                    from '../../../custom-hooks/input-hook';
import Button                                          from '@material-ui/core/Button';
import { getIpgs, getPlan, submitDiscount, subscribe } from '../../../../shared/services/user/subscription-service';
import ImageGenerator                                  from '../../../image-generator/image-generator';
import Loading                                from '../../../loading/item-loading/loading';
import { isPlatformBrowser, ModalTransition } from '../../../../shared/services/general/general-service';

export default function BillDialog ({ open, onClose, planId, title, programId = null, planType = 'subscription' }) {
	const nf                                      = new Intl.NumberFormat();
	const { value: discount, bind: bindDiscount } = useInput('');
	const [ipgs, setIpgs]                         = useState([]);
	const [discountStatus, setDiscountStatus]     = useState(null);
	const [selectedIpg, setSelectedIpg]           = useState(null);
	const [plan, setPlan]                         = useState(null);

	useEffect(() => {
		if (open) {
			getIpgs().then(
				(res) => {
					if (res.status === 200 && res.data.code === 200) {
						setIpgs(res.data.data);
						setSelectedIpg(res.data.data[ 0 ]);
					}
				}
			);
		} else {
			setDiscountStatus(null);
		}
	}, [open]);

	useEffect(() => {
		if (open) {
			getPlan(planId).then(
				(res) => {
					if (res.status === 200 && res.data.code === 200) {
						setPlan(res.data.data);
					}
				}
			);
		}
	}, [open, planId]);

	useEffect(() => {
		if (!open) setPlan(null);
	}, [open]);

	const renderIpgs = () => {
		const selectIpg = (ipg) => {
			setSelectedIpg(ipg);
		};

		return (
			<div className="ipgs">
				{ipgs.map((ipg, index) => {
					return (
						<div key={index}
							 onClick={() => selectIpg(ipg)}
							 className={`ipg ${selectedIpg === ipg ? 'selected-ipg' : ''}`}>
							<ImageGenerator src={ipg.image}
											name={ipg.name}/>
							<span>{ipg.name}</span>
						</div>
					);
				})}
			</div>
		);
	};

	const renderDiscount = () => {
		const handleSubmit = (e) => {
			e.preventDefault();
			setDiscountStatus(null);
			submitDiscount(plan.id, discount).then(
				(res) => {
					setDiscountStatus(res.data);
				}
			).catch(
				(error) => {
					setDiscountStatus(error.response.data);
				}
			);
		};

		const renderDiscountStatus = () => {
			if (discountStatus) {
				if (discountStatus.code === 404 || discountStatus.code === 400 || discountStatus.code === 404) {
					return (
						<span className="failed-discount">{discountStatus.message}</span>
					);
				}
			}
			return null;
		};

		return (
			<>
				{renderDiscountStatus()}
				{discountStatus && discountStatus.code === 200 ?
					null :
					<form autoComplete="off"
						  className="discount"
						  onSubmit={handleSubmit}
						  dir="rtl">
						<input {...bindDiscount}
							   type="text"
							   placeholder="کد تخفیف"/>
						<Button variant={'contained'}
								onClick={handleSubmit}>
							<span>اعمال</span>
						</Button>
					</form>}
			</>
		);
	};

	const renderData = () => {
		const calcDiscount = () => {
			const off = (plan?.price * discountStatus.data.discountPercent) / 100;
			if (off > discountStatus.data.maximum) {
				return discountStatus.data.maximum;
			}
			return off;
		};

		const renderDiscountIfSuccess = () => {
			if (discountStatus && discountStatus.code === 200) {
				return (
					<>
						<div className="info"
							 style={{ fontWeight: 'bold' }}>
							<span>جمع</span>
							<span>
								<span>{nf.format(plan.toPay)}</span>
								<span className="toman">تومان</span>
							</span>
						</div>
						<div className="success-discount">
							<div className="info info__off">
								<span>تخفیف</span>
								<span>
								<span>{nf.format(calcDiscount())}</span>
								<span className="toman">تومان</span>
							</span>
							</div>
							<div className="info info__final-price">
								<span>مبلغ قابل پرداخت</span>
								<span>
								<span>{nf.format(plan.toPay - calcDiscount())}</span>
								<span className="toman">تومان</span>
							</span>
							</div>
						</div>
					</>
				);
			}
			return (
				<div className="info info__final-price">
					<span>مبلغ قابل پرداخت</span>
					<span>
							<span>{nf.format(plan?.toPay)}</span>
							<span className="toman">تومان</span>
						</span>
				</div>
			);
		};

		return (
			<>
				<div className="info">
					<span>قیمت</span>
					<span>
						<span>{nf.format(plan?.price)}</span>
						<span className="toman">تومان</span>
					</span>
				</div>
				<div className="info">
					<span>مالیات بر ارزش افزوده</span>
					<span>
						<span>{nf.format(plan.vat)}</span>
						<span className="toman">تومان</span>
					</span>
				</div>
				{renderDiscountIfSuccess()}
			</>
		);
	};

	const goToPayment = () => {
		subscribe(planId, selectedIpg.id, discountStatus?.data?.voucher, planType === 'ticket' ? programId : null).then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					if (isPlatformBrowser()) {
						window.open(res.data.data.paymentLink, 'blank');
					}
				}
			}
		);
	};

	return (
		<Dialog fullScreen={window.innerWidth < 980}
				classes={{
					root : 'bill-dialog',
					paper: window.innerWidth < 980 ? '' : 'bill-dialog-paper'
				}}
				open={open}
				onClose={onClose}
				TransitionComponent={ModalTransition}>
			{plan ? <>
				<IconButton className="return-to-plans"
							onClick={onClose}>
					<ArrowBack/>
				</IconButton>
				<h2> صورتحساب {title}</h2>
				{planType === 'ticket' ?
					<span className="duration-alert">فرصت شما برای تماشای فیلم ، پس از خرید بلیط ، {plan.duration} {plan.timeUnit === 'HOUR' ? 'ساعت' : 'روز'} است.</span> : null}
				{renderData()}
				{renderDiscount()}
				{ipgs.length ? renderIpgs() : <Loading forceHeight={false}/>}
				<Button className="payment"
						onClick={() => goToPayment()}
						variant={'contained'}>
					<span>پرداخت</span>
				</Button>
			</> : <Loading/>}
		</Dialog>
	);
}
