import './linear-carousel.scss';
import React           from 'react';
import ImageGenerator  from '../../image-generator/image-generator';
import { Link }        from 'react-router-dom';
import { Icon }        from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';

function LinearCarousel ({ data, itemSubUrl }) {
	return (
		<div className="linear-carousel">
			<Link to={data?.deepLink ? data?.deepLink : `/`}
				  className="title">{data.title}</Link>
			<div className="movies">
				{data.objects.map((content, index) => {
					if (index < 10) {
						return (
							<Link key={index}
								  to={`/${itemSubUrl}/${content.id}`}
								  className="item">
								<div>
									<ImageGenerator src={content.image}
													name={content.title}/>
									<span className="box-title">{content.title}</span>
								</div>
							</Link>
						);
					}
					return null;
				})}
			</div>
			<Link className="title blue-title"
				  to={data?.deepLink ? data?.deepLink : `/`}>
				<span>موارد بیشتر</span>
				<Icon component={ChevronLeft}/>
			</Link>
		</div>
	);
}

export default LinearCarousel;
