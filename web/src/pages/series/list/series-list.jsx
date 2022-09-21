import './series-list.scss';
import React, { useEffect }         from 'react';
import Loading                      from '../../../components/loading/item-loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { getSeriesLandingPage }     from '../../../shared/services/home/home-service';
import seriesActions                from '../../../store/actions/series-landings.action';
import BaseEntity                   from '../../../components/base-entity/base-entity';
import { setTitle }                 from '../../../shared/services/general/general-service';

function SeriesListPage () {
	const data     = useSelector(state => state.seriesData);
	const dispatch = useDispatch();

	useEffect(() => {
		setTitle('سریال');
		if (data.length === 0) {
			getSeriesLandingPage().then(
				(result) => {
					let response = result.data;
					if (response.code === 200) {
						let temp_data = response.data;
						temp_data.sort((a, b) => {
							if (a.order < b.order) return -1;
							if (a.order > b.order) return 1;
							return 0;
						});
						dispatch(seriesActions(temp_data));
					}
				}
			);
		}
	}, [data, dispatch]);

	const render_data = () => {
		return (
			<div>
				<BaseEntity data={data}
							baseUrl={'series'}/>
			</div>
		);
	};

	return (
		<div className="container">
			{data && data.length ? render_data() : <Loading/>}
		</div>
	);
}

export default SeriesListPage;
