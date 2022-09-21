import React from 'react';
import Loading from '../../../../components/loading/loading';

export default function UserInvoices({ invoices, isShowInvoices = true, isLoadInvoices }) {
	const renderInvoice = (invoice, index) => {
		return (
			<div key={index}>
				<span>{invoice.id}</span>
				<span>{invoice.price}</span>
				<span>{invoice.confirmed}</span>
			</div>
		);
	};

	if (!isShowInvoices) return null;

	return (
		<div className='user-details'>
			<h3>پرداختی‌ها</h3>
			{!isLoadInvoices ? (
				<Loading />
			) : (
				<div className='invoices'>{invoices && invoices.length ? invoices?.map((invoice, index) => renderInvoice(invoice, index)) : <span> پرداختی نداشته است.</span>}</div>
			)}
		</div>
	);
}
