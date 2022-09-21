import '../card.scss';
import React          from 'react';
import { Link }       from 'react-router-dom';
import ImageGenerator from '../../image-generator/image-generator';

function SeriesCard ({ data }) {
	return (
		<Link className="content-item"
			  to={`/series/${data.id}`}>
			<div>
				<ImageGenerator src={data.image}
								name={data.title}/>
				<span className="item-title text-truncate">{data.title}</span>
			</div>
		</Link>
	);
}

export default SeriesCard;
