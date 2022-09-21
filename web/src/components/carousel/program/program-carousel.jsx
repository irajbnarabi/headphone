import './program-carousel.scss';
import React                  from 'react';
import { useHistory }         from 'react-router-dom';
import MovieCard              from '../../card/movie-card/movie-card';
import { render_object_type } from '../../../shared/services/general/configs';
import SeriesCard             from '../../card/series-card/series-card';

function ProgramCarousel ({ data, type }) {
	const history = useHistory();

	const goToDeepLink = () => {
		history.push(data.deepLink);
	};

	return (
		<div className="carousel program-carousel">
			<div className="carousel-header">
				<span>{data.title}</span>
				<span onClick={() => {goToDeepLink();}}>{data.moreTitle}</span>
			</div>
			<div className="carousel-body">
				{data?.objects.map((value, index) => {
					if (index < 10) {
						if (type === render_object_type.movie) {
							return <MovieCard key={index}
											  data={value}/>;
						} else if (type === render_object_type.series) {
							return <SeriesCard key={index}
											   data={value}/>;
						} else {
							return null;
						}
					}
					return null;
				})}
			</div>
		</div>
	);
}

export default ProgramCarousel;
