import './invoice.scss';
import React, { useEffect, useState } from 'react';
import { getInvoice }                 from '../../../shared/services/user/subscription-service';
import Loading                        from '../../../components/loading/item-loading/loading';
import { useDispatch, useSelector }   from 'react-redux';
import { getProfile }                 from '../../../shared/services/user/user-service';
import profileActions                 from '../../../store/actions/profile.action';
import ErrorHandler                   from '../../../components/error-handler/error-handler';
import { setTitle }                   from '../../../shared/services/general/general-service';

function InvoicePage (props) {
	const [invoice, setInvoice]           = useState(null);
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
		setTitle('فاکتور فروش');
		getInvoice(props.match.params.refId).then(
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

	return (
		<div style={{ textAlign: 'center', marginTop: '10rem' }}>
			{invoice.confirmed ? 'پرداخت موفق' : 'پرداخت ناموفق'}
		</div>
	);
}

export default InvoicePage;
