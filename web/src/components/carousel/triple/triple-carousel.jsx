import './triple-carousel.scss';
import React          from 'react';
import ImageGenerator from '../../image-generator/image-generator';
import { Link }       from 'react-router-dom';

function TripleCarousel ({ data, baseUrl, moreTitle }) {
	return (
		<div className="triple-carousel">
			{data.map((value, index) => {
				return (
					<div key={index}
						 className="item">
						<Link className="item-name"
							  to={value.deepLink}>{value.title}</Link>
						<div className="item-movies">
							{value.objects.map((content, index1) => {
								if (index1 < 3) {
									return (
										<Link className="movie"
											  to={`/${baseUrl}/${content.id}`}
											  key={index1}>
											<ImageGenerator src={content.image}
															isLazy={false}
															name={''}/>
											<div className="movie-info">
												<div className="title">{content.title}</div>
												<div className="award">{content.name}</div>
											</div>
										</Link>
									);
								}
								return null;
							})}
						</div>
						<Link to={value.deepLink}
							  className="more-title">{moreTitle}</Link>
					</div>
				);
			})}
		</div>
	);
}

export default TripleCarousel;
