import React from 'react';
import Plans from './plans/Plans';
import Layout from '../../components/layout/Layout';
import Discounts from './discount/Discount';

export default function SubscriptionPage() {
	return (
		<Layout>
			<div style={{ width: '100%' }}>
				<Plans />
				<hr style={{ margin: '2rem 0' }} />
				<Discounts />
			</div>
		</Layout>
	);
}
