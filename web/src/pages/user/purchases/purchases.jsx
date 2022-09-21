import './purchases.scss';
import React, { useEffect, useState } from 'react';
import { useHistory }                 from 'react-router-dom';
import { getInvoices }                from '../../../shared/services/user/subscription-service';
import Loading                        from '../../../components/loading/item-loading/loading';
import ImageGenerator                from '../../../components/image-generator/image-generator';
import { handleTimeStamp, setTitle } from '../../../shared/services/general/general-service';
import { useDispatch, useSelector }  from 'react-redux';
import { getProfile }                 from '../../../shared/services/user/user-service';
import profileActions                 from '../../../store/actions/profile.action';
import ErrorHandler                   from '../../../components/error-handler/error-handler';

function Purchases () {
	const [purchases, setPurchases]       = useState(null);
	const history                         = useHistory();
	const { profile, isLoad }             = useSelector(state => state.profileData);
	const [errorHandler, setErrorHandler] = useState(null);
	const dispatch                        = useDispatch();
	const nf                              = new Intl.NumberFormat();

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
		setTitle('لیست سفارشات خرید');
		getInvoices().then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					setPurchases(res.data.data);
				}
			}
		);
	}, []);

	if (!isLoad && !errorHandler) return <Loading/>;

	if (!isLoad && errorHandler) return <ErrorHandler error={errorHandler}/>;

	if (!purchases) {
		return <Loading/>;
	}

	if (purchases.length === 0) {
		return <div>تا کنون خریدی نداشته‌اید</div>;
	}

	const purchasesListHeader = () => {
		return (
			<div className="purchases-list-header">
				<div>
					<span>تاریخ</span>
				</div>
				<div>
					<span>موضوع خرید</span>
				</div>
				<div>
					<span>مبلغ پرداخت شده</span>
				</div>
				<div>
					<span>وضعیت</span>
				</div>
				<div>
					<span/>
				</div>
			</div>
		);
	};

	const purchasesListItem = (purchase, index) => {
		if (purchase.type === 'TICKET') {
			return <div key={index}
						onClick={() => history.push(`purchases/${purchase.id}`)}
						className="purchase-item">
				<div className="purchase-date">
					<span>{purchase.confirmed ? handleTimeStamp(purchase?.paidDate) : handleTimeStamp(purchase?.date)}</span>
				</div>
				<div className="title ticket">
					<ImageGenerator src={purchase.programImage}
									isLazy={false}
									name={''}/>
					<div className="title-content">
						<span>{purchase.name}</span>
						<span className="purchase-date-under-title">
							<div>
								<span>{purchase.confirmed ? handleTimeStamp(purchase?.paidDate, 'onlyDate') : handleTimeStamp(purchase?.date, 'onlyDate')}</span>
							</div>
							<div>
								<span>{purchase.confirmed ? handleTimeStamp(purchase?.paidDate, 'onlyTime') : handleTimeStamp(purchase?.date, 'onlyTime')}</span>
							</div>
						</span>
					</div>
				</div>
				<div className="purchase-off">
					<span>
						<span>{nf.format(purchase?.paid)}</span>
						<span> تومان </span>
					</span>
				</div>
				<div className="status">
					<span className={purchase.confirmed ? 'success' : 'failed'}>{purchase.confirmed ? 'موفق' : 'ناموفق'}</span>
				</div>
				<div className="purchases-details">
					<span>مشاهده جزئیات</span>
				</div>
			</div>;
		}
		return <div key={index}
					onClick={() => history.push(`purchases/${purchase.id}`)}
					className="purchase-item">
			<div className="purchase-date">
				<span>{purchase.confirmed ? handleTimeStamp(purchase?.paidDate) : handleTimeStamp(purchase?.date)}</span>
			</div>
			<div className="title">
				<span>{purchase.name}</span>
				<span className="purchase-date-under-title">
					<span>{purchase.confirmed ? handleTimeStamp(purchase?.paidDate) : handleTimeStamp(purchase?.date)}</span>
				</span>
			</div>
			<div className="purchase-off">
				<span>
					<span>{nf.format(purchase?.paid)}</span>
					<span> تومان </span>
				</span>
			</div>
			<div className="status">
				<span className={purchase.confirmed ? 'success' : 'failed'}>{purchase.confirmed ? 'موفق' : 'ناموفق'}</span>
			</div>
			<div className="purchases-details">
				<span>مشاهده جزئیات</span>
			</div>
		</div>;
	};

	return (
		<div className="purchases-container">
			<h2>فهرست سابقه‌ی خریدها</h2>
			<div className="purchases-list-view">
				{purchasesListHeader()}
				{purchases.map((item, index) => purchasesListItem(item, index))}
			</div>
		</div>
	);
}

export default Purchases;
