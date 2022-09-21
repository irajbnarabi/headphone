import './Analytics.scss';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import eventConfigs from './EventConfigs';
import eventTypes from './event-types/EventTypes';

function AnalyticsPage(props) {
	const [eventName, setEventName] = useState(null);

	useEffect(() => {
		setEventName(props.match.params.eventName);
	}, [props]);

	const renderEvents = () => {
		if (eventName === eventConfigs.eventTypes.VIEW.eventName) {
			return eventTypes.renderViewEvent();
		} else if (eventName === eventConfigs.eventTypes.LOGIN.eventName) {
			return eventTypes.renderLoginEvent();
		} else if (eventName === eventConfigs.eventTypes.REGISTER.eventName) {
			return eventTypes.renderRegisterEvent();
		} else if (eventName === eventConfigs.eventTypes.SUBSCRIBE.eventName) {
			return eventTypes.renderSubscribeEvent();
		} else if (eventName === eventConfigs.eventTypes.SEARCH.eventName) {
			return eventTypes.renderSearchEvent();
		} else if (eventName === eventConfigs.eventTypes.WATCH.eventName) {
			return eventTypes.renderWatchEvent();
		} else if (eventName === eventConfigs.eventTypes.DISCOUNT.eventName) {
			return eventTypes.renderDiscountEvent();
		}
	};

	return <Layout>{renderEvents()}</Layout>;
}

export default AnalyticsPage;
