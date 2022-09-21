import './purchase-details.scss';
import React, { useEffect, useState } from 'react';
import { Button }                     from '@material-ui/core';
import { getInvoice }                 from '../../../../shared/services/user/subscription-service';
import Loading                        from '../../../../components/loading/item-loading/loading';
import { useHistory }                from 'react-router-dom';
import { handleTimeStamp, setTitle } from '../../../../shared/services/general/general-service';
import ImageGenerator                from '../../../../components/image-generator/image-generator';
import { useDispatch, useSelector }   from 'react-redux';
import { getProfile }                 from '../../../../shared/services/user/user-service';
import profileActions                 from '../../../../store/actions/profile.action';
import ErrorHandler                   from '../../../../components/error-handler/error-handler';

function PurchaseDetails (props) {
	const [invoice, setInvoice]           = useState(null);
	const history                         = useHistory();
	const nf                              = new Intl.NumberFormat();
	const { profile, isLoad }             = useSelector(state => state.profileData);
	const [errorHandler, setErrorHandler] = useState(null);
	const dispatch                        = useDispatch();

	useEffect(() => {
		if (!profile) {
			getProfile().then(
				(result) => {
					if (result.status === 200 && result.data.code === 200) {
						dispatch(profileActions(result.data.data));
					}
				}
			).catch(
				(error) => {
					setErrorHandler(error);
				}
			);
		}
	}, [profile, dispatch]);

	useEffect(() => {
		setTitle('سفارش خرید');
		getInvoice(props.match.params.id).then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					setInvoice(res.data.data);
				}
			}
		);
	}, [props]);

	if (!isLoad && !errorHandler) return <Loading/>;

	if (!isLoad && errorHandler) return <ErrorHandler error={errorHandler}/>;

	if (!invoice) {
		return <Loading/>;
	}

	const renderData = () => {
		return (
			<>
				<div className="title ticket">
					{invoice.type === 'TICKET' ?
						<ImageGenerator src={invoice.programImage}
										isLazy={false}
										name={''}/> : null}
					<span>{invoice.name}</span>
				</div>
				<div className="date">
					<div>
						<span>تاریخ</span>
					</div>
					<div>
						<span>{invoice.confirmed ? handleTimeStamp(invoice?.paidDate) : handleTimeStamp(invoice?.date)}</span>
					</div>
				</div>
				<div className="price">
					<div>
						<span>قیمت</span>
					</div>
					<div>
						<span>
							<span>{nf.format(invoice.price)}</span>
							<span> تومان </span>
						</span>
					</div>
				</div>
				<div className="tax">
					<div>
						<span>مالیات بر ارزش افزوده</span>
					</div>
					<div>
						<span>
							<span>{nf.format(invoice.vat)}</span>
							<span> تومان </span>
						</span>
					</div>
				</div>
				<div className="total">
					<div>
						<span>جمع</span>
					</div>
					<div>
						<span>
							<span>{nf.format(invoice.price + invoice.vat)}</span>
							<span> تومان </span>
						</span>
					</div>
				</div>
				<div className="purchase-discount">
					<div>
						<span>تخفیف</span>
					</div>
					<div>
						<span>
							<span>{nf.format(invoice.discount)}</span>
							<span> تومان </span>
						</span>
					</div>
				</div>
				<div className="discount-code">
					<div>
						<span>کد تخفیف</span>
					</div>
					<div>
						<span>{invoice?.discountVoucher}</span>
					</div>
				</div>
				<div className="total-price">
					<div>
						<span>مبلغ پرداخت‌شده</span>
					</div>
					<div>
						<span>
							<span>{nf.format(invoice.paid)}</span>
							<span> تومان </span>
						</span>
					</div>
				</div>
			</>
		);
	};

	return (
		<div className="purchase-details-container">
			<div className="purchase-details">
				<h2>سابقه‌ی خریدها</h2>
				<div className="purchase-details-box">
					{renderData()}
				</div>
				<Button variant={'contained'}
						onClick={() => history.push('/purchases')}
						className="return-to-purchases">
					<span>بازگشت</span>
				</Button>
			</div>
		</div>
	);
}

export default PurchaseDetails;
