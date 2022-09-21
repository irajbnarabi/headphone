import './tag-carousel.scss';
import React          from 'react';
import ImageGenerator from '../../image-generator/image-generator';
import { Link }       from 'react-router-dom';

function TagCarousel ({ data }) {
	return (
		<div className="tag-carousel">
			<div className="carousel-header">
				<span>{data.title}</span>
			</div>
			<div className="carousel-body">
				{data.objects.map((value, index) => {
					return (
						<Link className="carousel-item"
							  to={`/t/${value.tagDefinitionName}/${value.id}`}
							 key={index}>
							<ImageGenerator src={value?.fields?.image}
											name={value.value}/>
							<div className="item-title">{value.value}</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

export default TagCarousel;
