import React, { useEffect, useState } from 'react';
import LineChart from '../../../components/charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import eventConfigs from '../EventConfigs';
import analyticsActions from '../../../../state/analitycs/action';
import Loading from '../../../components/loading/loading';
import moment from 'moment';
import { Button, TextField } from '@material-ui/core';
import RangeDatePicker from './RangeDatePicker';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import programActions from '../../../../state/program/action';
import subscriptionActions from '../../../../state/subscription/action';
import CustomTable from '../../../components/table/table';

const subscriptionType = [
	{
		titleFa: 'همه',
		titleEn: '',
	},
	{
		titleFa: 'اشتراک',
		titleEn: 'SUBSCRIPTION',
	},
	{
		titleFa: 'بلیط',
		titleEn: 'TICKET',
	},
];

function EventSubscribe() {
	const { data, isLoad, hotData, isLoadHot, hotTotalPages } = useSelector((state) => state.analyticsReducer);
	const [form, setFormRaw] = useState(eventConfigs.eventTypes.SUBSCRIBE.body);
	const dispatch = useDispatch();
	const [labels, setLabels] = useState(null);
	const [dataset, setDataset] = useState(null);
	const [fromDate, setFromDate] = useState(new Date(Date.now() - 604800000));
	const [toDate, setToDate] = useState(new Date());
	const { programs } = useSelector((state) => state.programReducer);
	const [searchProgramQuery, setSearchProgramQuery] = useState('');
	const { plans } = useSelector((state) => state.subscriptionReducer);
	const [searchPlanQuery, setSearchPlanQuery] = useState('');
	const [hotCurrentPage, setHotCurrentPage] = useState(1);

	const setForm = (keyVal) => {
		setFormRaw({ ...eventConfigs.eventTypes.SUBSCRIBE.body, ...form, ...keyVal });
	};

	useEffect(() => {
		const from = moment(fromDate).unix();
		const to = moment(toDate).unix();
		dispatch(analyticsActions.getData(eventConfigs.eventTypes.SUBSCRIBE.eventName, from, to, eventConfigs.eventTypes.SUBSCRIBE.body));
		dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SUBSCRIBE.eventName, from, to, eventConfigs.eventTypes.SUBSCRIBE.body));
	}, []);

	useEffect(() => {
		if (data) {
			setLabels(Object.keys(data));
			setDataset(Object.values(data));
		}
	}, [data]);

	useEffect(() => {
		dispatch(programActions.searchProgram('', searchProgramQuery));
	}, [searchProgramQuery]);

	useEffect(() => {
		dispatch(subscriptionActions.searchPlans(searchPlanQuery));
	}, [searchPlanQuery]);

	const renderChart = () => {
		if (!isLoad) {
			return <Loading />;
		}
		return <LineChart data={dataset} chartLabel={eventConfigs.eventTypes.SUBSCRIBE.eventNameFa} labels={labels} />;
	};

	const renderForm = () => {
		const handleSubmit = () => {
			const from = moment(fromDate).unix();
			const to = moment(toDate).unix();
			dispatch(analyticsActions.getData(eventConfigs.eventTypes.SUBSCRIBE.eventName, from, to, form));
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SUBSCRIBE.eventName, from, to, form));
		};

		return (
			<form>
				<TextField select label='نوع' fullWidth value={form.type} onChange={(e) => setForm({ type: e.target.value })} variant='outlined'>
					{subscriptionType.map((option, index) => (
						<MenuItem key={index} value={option.titleEn}>
							<span>{option.titleFa}</span>
						</MenuItem>
					))}
				</TextField>
				<Autocomplete
					id='combo-box-plans'
					options={plans && plans.length ? plans : []}
					fullWidth
					onInputChange={(e, value) => setSearchPlanQuery(value)}
					onChange={(e, value) => setForm({ id: value?.id ? value.id : '' })}
					getOptionLabel={(option) => option.name + ` ${option.type === subscriptionType[1].titleEn ? '(اشتراک)' : '(بلیط)'}`}
					freeSolo
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					renderInput={(params) => <TextField {...params} label='عنوان' variant='outlined' />}
				/>
				<Autocomplete
					id='combo-box-program'
					options={programs && programs.length ? programs : []}
					fullWidth
					onInputChange={(e, value) => setSearchProgramQuery(value)}
					onChange={(e, value) => setForm({ programId: value?.id ? value.id : '' })}
					getOptionLabel={(option) => option.title}
					freeSolo
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					renderInput={(params) => <TextField {...params} label='عنوان برنامه' variant='outlined' />}
				/>
				<Button variant={'contained'} onClick={handleSubmit} fullWidth={true}>
					<span>ثبت</span>
				</Button>
			</form>
		);
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
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.SUBSCRIBE.eventName, from, to, form, selectedPage));
		};
		return <CustomTable currentPage={hotCurrentPage} totalPage={hotTotalPages} headers={headers} loadSelectedPage={(selectedPage) => handlePagination(selectedPage)} data={hotData} />;
	};

	return (
		<div className='analytics-base-container'>
			<b>{eventConfigs.eventTypes.SUBSCRIBE.eventNameFa}</b>
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
export default EventSubscribe;
