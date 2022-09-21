import React, { useEffect, useState } from 'react';
import LineChart from '../../../components/charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import eventConfigs from '../EventConfigs';
import analyticsActions from '../../../../state/analitycs/action';
import Loading from '../../../components/loading/loading';
import moment from 'moment';
import { Button } from '@material-ui/core';
import RangeDatePicker from './RangeDatePicker';

function EventRegister() {
	const { data, isLoad } = useSelector((state) => state.analyticsReducer);
	const [form] = useState(eventConfigs.eventTypes.REGISTER.body);
	const dispatch = useDispatch();
	const [labels, setLabels] = useState(null);
	const [dataset, setDataset] = useState(null);
	const [fromDate, setFromDate] = useState(new Date(Date.now() - 604800000));
	const [toDate, setToDate] = useState(new Date());

	useEffect(() => {
		const from = moment(fromDate).unix();
		const to = moment(toDate).unix();
		dispatch(analyticsActions.getData(eventConfigs.eventTypes.REGISTER.eventName, from, to, eventConfigs.eventTypes.REGISTER.body));
	}, []);

	useEffect(() => {
		if (data) {
			setLabels(Object.keys(data));
			setDataset(Object.values(data));
		}
	}, [data]);

	const renderChart = () => {
		if (!isLoad) {
			return <Loading />;
		}
		return <LineChart data={dataset} chartLabel={eventConfigs.eventTypes.REGISTER.eventNameFa} labels={labels} />;
	};

	const renderForm = () => {
		const handleSubmit = () => {
			const from = moment(fromDate).unix();
			const to = moment(toDate).unix();
			dispatch(analyticsActions.getData(eventConfigs.eventTypes.REGISTER.eventName, from, to, form));
		};

		return (
			<form>
				<Button variant={'contained'} onClick={handleSubmit} fullWidth={true}>
					<span>ثبت</span>
				</Button>
			</form>
		);
	};

	return (
		<div className='analytics-base-container'>
			<b>{eventConfigs.eventTypes.REGISTER.eventNameFa}</b>
			<div className='analytics-container'>
				<div className='analytics-form'>
					<RangeDatePicker fromDate={fromDate} setFromDate={(date) => setFromDate(date)} toDate={toDate} setToDate={(date) => setToDate(date)} />
					{renderForm()}
				</div>
				<div className='analytics-chart'>
					<div>{renderChart()}</div>
				</div>
			</div>
		</div>
	);
}
export default EventRegister;
