import './home.scss';
import React, { useEffect } from 'react';
import { getHomePage } from '../../../shared/services/home/home-service';
import { useDispatch, useSelector } from 'react-redux';
import homeActions from '../../../store/actions/home.action';
import Loading from '../../../components/loading/item-loading/loading';
import { hideFirstViewPreloading } from '../../../shared/services/general/preloading-service';
import { setTitle } from '../../../shared/services/general/general-service';
import BaseEntity from '../../../components/base-entity/base-entity';

function HomePage() {
	const data = useSelector(state => state.homeData);
	const dispatch = useDispatch();

	useEffect(() => {
		if (data.length === 0) {
			getHomePage().then(
				(result) => {
					hideFirstViewPreloading();
					let response = result.data;
					if (response.code === 200) {
						let temp_data = response.data;
						temp_data.sort((a, b) => {
							if (a.order < b.order) return -1;
							if (a.order > b.order) return 1;
							return 0;
						});
						dispatch(homeActions(temp_data));
					}
				}
			);
		}
	}, [data, dispatch]);

	const renderPageHeader = () => {
		setTitle('Vidosign | مرجع تماشای فیلم و سریال');
	};

	const renderData = () => {
		return (
			<div>
				{renderPageHeader()}
				<BaseEntity data={data} />
			</div>
		);
	};

	if (data && data.length === 0) {
		return <Loading />;
	}

	return (
		<div className="container">
			{renderData()}
		</div>
	);
}

export default HomePage;
