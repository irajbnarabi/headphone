import React, { useEffect, useState } from 'react';
import LineChart from '../../../components/charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import eventConfigs from '../EventConfigs';
import analyticsActions from '../../../../state/analitycs/action';
import Loading from '../../../components/loading/loading';
import RangeDatePicker from './RangeDatePicker';
import moment from 'moment';
import { Button, TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import subscriptionActions from '../../../../state/subscription/action';
import CustomTable from '../../../components/table/table';

const discountType = [
	{
		titleFa: 'همه',
		titleEn: '',
	},
	{
		titleFa: 'یک بار',
		titleEn: 'ONE_TIME',
	},
	{
		titleFa: 'عادی',
		titleEn: 'REGULAR',
	},
];

function EventDiscount() {
	const { data, isLoad, hotData, isLoadHot, hotTotalPages } = useSelector((state) => state.analyticsReducer);
	const [form, setFormRaw] = useState(eventConfigs.eventTypes.DISCOUNT.body);
	const dispatch = useDispatch();
	const [labels, setLabels] = useState(null);
	const [dataset, setDataset] = useState(null);
	const [fromDate, setFromDate] = useState(new Date(Date.now() - 604800000));
	const [toDate, setToDate] = useState(new Date());
	const { discounts } = useSelector((state) => state.subscriptionReducer);
	const [searchDiscountQuery, setSearchDiscountQuery] = useState('');
	const [hotCurrentPage, setHotCurrentPage] = useState(1);

	const setForm = (keyVal) => {
		setFormRaw({ ...eventConfigs.eventTypes.DISCOUNT.body, ...form, ...keyVal });
	};

	useEffect(() => {
		const from = moment(fromDate).unix();
		const to = moment(toDate).unix();
		dispatch(analyticsActions.getData(eventConfigs.eventTypes.DISCOUNT.eventName, from, to, eventConfigs.eventTypes.DISCOUNT.body));
		dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.DISCOUNT.eventName, from, to, eventConfigs.eventTypes.DISCOUNT.body));
	}, []);

	useEffect(() => {
		if (data) {
			setLabels(Object.keys(data));
			setDataset(Object.values(data));
		}
	}, [data]);

	useEffect(() => {
		dispatch(subscriptionActions.searchDiscounts(searchDiscountQuery));
	}, [searchDiscountQuery]);

	const renderChart = () => {
		if (!isLoad) {
			return <Loading />;
		}
		return <LineChart data={dataset} chartLabel={eventConfigs.eventTypes.DISCOUNT.eventNameFa} labels={labels} />;
	};

	const renderTable = () => {
		const headers = [
			{
				label: 'شناسه',
				align: 'left',
			},
			{
				label: 'کوپن',
				align: 'center',
			},
			{
				label: 'تعداد استفاده',
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
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.DISCOUNT.eventName, from, to, form, selectedPage));
		};
		return <CustomTable currentPage={hotCurrentPage} totalPage={hotTotalPages} headers={headers} loadSelectedPage={(selectedPage) => handlePagination(selectedPage)} data={hotData} />;
	};

	const renderForm = () => {
		const handleSubmit = () => {
			const from = moment(fromDate).unix();
			const to = moment(toDate).unix();
			dispatch(analyticsActions.getData(eventConfigs.eventTypes.DISCOUNT.eventName, from, to, form));
			dispatch(analyticsActions.getHotData(eventConfigs.eventTypes.DISCOUNT.eventName, from, to, form));
		};

		return (
			<form>
				<TextField select label='نوع' fullWidth value={form.type} onChange={(e) => setForm({ type: e.target.value })} variant='outlined'>
					{discountType.map((option, index) => (
						<MenuItem key={index} value={option.titleEn}>
							<span>{option.titleFa}</span>
						</MenuItem>
					))}
				</TextField>
				<Autocomplete
					id='combo-box-discounts'
					options={discounts && discounts.length ? discounts : []}
					fullWidth
					onInputChange={(e, value) => setSearchDiscountQuery(value)}
					onChange={(e, value) => setForm({ voucher: value?.voucher ? value.voucher : '' })}
					getOptionLabel={(option) => option.voucher}
					freeSolo
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					renderInput={(params) => <TextField {...params} label='کوپن' variant='outlined' />}
				/>
				<Button variant={'contained'} onClick={handleSubmit} fullWidth={true}>
					<span>ثبت</span>
				</Button>
			</form>
		);
	};

	return (
		<div className='analytics-base-container'>
			<b>{eventConfigs.eventTypes.DISCOUNT.eventNameFa}</b>
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

export default EventDiscount;
