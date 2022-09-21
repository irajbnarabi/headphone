import React, { useEffect, useState } from 'react';
import LineChart from '../../../components/charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import eventConfigs from '../EventConfigs';
import analyticsActions from '../../../../state/analitycs/action';
import Loading from '../../../components/loading/loading';
import RangeDatePicker from './RangeDatePicker';
import moment from 'moment';
import { Button, TextField } from '@material-ui/core';
import CustomTable from '../../../components/table/table';

function EventSearch() {
	const { data, isLoad, hotData, isLoadHot, hotTotalPages } = useSelector((state) => state.analyticsReducer);
	const [form, setFormRaw] = useState(eventConfigs.eventTypes.SEARCH.body);
	const dispatch = useDispatch();
	const [labels, setLabels] = useState(null);
	const [dataset, setDataset] = useState(null);
	const [fromDate, setFromDate] = useState(new Date(Date.now() - 604800000));
	const [toDate, setToDate] = useState(new Date());
	const [hotCurrentPage, setHotCurrentPage] = useState(1);

	const setForm = (keyVal) => {
		setFormRaw({ ...eventConfigs.eventTypes.SEARCH.body, ...form, ...keyVal });
	};

	useEffect(() => {
		const from = moment(fromDate).unix();
		const to = moment(toDate).unix();
		dispatch(analyticsActions.getData(eventConfigs.eventTypes.SEARCH.eventName, from, to, eventConfigs.eventTypes.SEARCH.body));
		dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SEARCH.eventName, from, to, eventConfigs.eventTypes.SEARCH.body));
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
		return <LineChart data={dataset} chartLabel={eventConfigs.eventTypes.SEARCH.eventNameFa} labels={labels} />;
	};

	const renderTable = () => {
		const headers = [
			{
				id: 'id',
				label: 'شناسه',
				align: 'left',
			},
			{
				id: 'title',
				label: 'عنوان',
				align: 'center',
			},
			{
				id: 'count',
				label: 'تعداد بازدید',
				align: 'right',
			},
		];
		if (!isLoadHot) {
			return <Loading />;
		}
		const handlePagination = (selectedPage) => {
			setHotCurrentPage(selectedPage);
			const from = moment(fromDate).unix();
			const to = moment(toDate).unix();
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SEARCH.eventName, from, to, form, selectedPage));
		};
		return <CustomTable currentPage={hotCurrentPage} totalPage={hotTotalPages} headers={headers} loadSelectedPage={(selectedPage) => handlePagination(selectedPage)} data={hotData} />;
	};

	const renderForm = () => {
		const handleSubmit = () => {
			const from = moment(fromDate).unix();
			const to = moment(toDate).unix();
			dispatch(analyticsActions.getData(eventConfigs.eventTypes.SEARCH.eventName, from, to, form));
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SEARCH.eventName, from, to, form));
		};

		return (
			<form>
				<TextField
					fullWidth
					label='متن جستجو'
					value={form.q}
					onChange={(e) => setForm({ q: e.target.value })}
					variant='outlined'
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<Button variant={'contained'} onClick={handleSubmit} fullWidth={true}>
					<span>ثبت</span>
				</Button>
			</form>
		);
	};

	return (
		<div className='analytics-base-container'>
			<b>{eventConfigs.eventTypes.SEARCH.eventNameFa}</b>
			<div className='analytics-container'>
				<div className='analytics-form'>
					<RangeDatePicker fromDate={fromDate} setFromDate={(date) => setFromDate(date)} toDate={toDate} setToDate={(date) => setToDate(date)} />
					{renderForm()}
				</div>
				<div className='analytics-chart'>
					<div>{renderChart()}</div>
					<div>{renderTable()}</div>
				</div>
			</div>
		</div>
	);
}

export default EventSearch;
