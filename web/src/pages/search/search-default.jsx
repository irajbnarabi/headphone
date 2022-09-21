import './search-default.scss';
import React, { useEffect, useState } from 'react';
import { getSearchIntroMovies, getSearchIntroSeries } from '../../shared/services/search/search-service';
import { useDispatch, useSelector } from 'react-redux';
import { searchIntroMoviesAction, searchIntroSeriesAction } from '../../store/actions/search.action';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Box } from '@material-ui/core';
import Loading from '../../components/loading/item-loading/loading';
import LinearCarousel from '../../components/carousel/linear/linear-carousel';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box p={3}
					style={{ padding: '24px 0' }}>
					<span>{children}</span>
				</Box>
			)}
		</div>
	);
}

function SearchDefault() {
	const moviesData = useSelector(state => state.searchIntroMovies);
	const seriesData = useSelector(state => state.searchIntroSeries);
	const dispatch = useDispatch();
	const [value, setValue] = useState(0);

	useEffect(() => {
		getSearchIntroMovies().then(
			(res) => {
				if (res.data.code === 200) {
					dispatch(searchIntroMoviesAction(res.data.data));
				}
			}
		);
	}, [dispatch]);

	useEffect(() => {
		getSearchIntroSeries().then(
			(res) => {
				if (res.data.code === 200) {
					dispatch(searchIntroSeriesAction(res.data.data));
				}
			}
		);
	}, []);

	const renderContentTab = (data, type) => data.map((value, index) => {
		if (value.objects && value.objects.length) {
			return (
				<div key={index}>
					<LinearCarousel data={value}
						itemSubUrl={type} />
				</div>
			);
		}
		return null;
	});

	const renderTabs = () => {
		const handleChange = (event, newValue) => {
			setValue(newValue);
		};

		return (
			<div className="search-default-container">
				<AppBar position="static"
					className="search-default-tab">
					<Tabs value={value}
						onChange={handleChange}
						aria-label="simple tabs example">
						<Tab label="فیلم" />
						<Tab label="سریال" />
					</Tabs>
				</AppBar>
				<TabPanel value={value}
					index={0}>
					{renderContentTab(moviesData, 'movies')}
				</TabPanel>
				<TabPanel value={value}
					index={1}>
					{renderContentTab(seriesData, 'series')}
				</TabPanel>
			</div>
		);
	};

	if (moviesData.length === 0) {
		return <Loading />;
	}

	return renderTabs();
}

export default SearchDefault;
