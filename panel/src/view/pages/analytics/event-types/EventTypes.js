import React from 'react';
import EventLogin from './EventLogin';
import EventRegister from './EventRegister';
import EventSearch from './EventSearch';
import EventSubscribe from './EventSubscribe';
import EventView from './EventView';
import EventWatch from './EventWatch';
import EventDiscount from './EventDiscount';

const renderLoginEvent = () => {
	return <EventLogin />;
};
const renderRegisterEvent = () => {
	return <EventRegister />;
};
const renderSearchEvent = () => {
	return <EventSearch />;
};
const renderSubscribeEvent = () => {
	return <EventSubscribe />;
};
const renderViewEvent = () => {
	return <EventView />;
};
const renderWatchEvent = () => {
	return <EventWatch />;
};
const renderDiscountEvent = () => {
	return <EventDiscount />;
};

const eventTypes = {
	renderLoginEvent,
	renderRegisterEvent,
	renderSearchEvent,
	renderSubscribeEvent,
	renderViewEvent,
	renderWatchEvent,
	renderDiscountEvent,
};
export default eventTypes;
