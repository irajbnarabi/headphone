import './list-view.scss';
import React                  from 'react';
import ImageGenerator         from '../image-generator/image-generator';
import { Link }               from 'react-router-dom';
import { render_object_type } from '../../shared/services/general/configs';

function ListView ({ data, type }) {
	return (
		<div className="box-of-items">
			{data?.map((item, index) => {
				if (type === 'movies' || type === render_object_type.movie) {
					return (
						<Link key={index}
							  to={`/movies/${item.id}`}
							  className="card">
							<ImageGenerator src={item.image}
											name={item.title}/>
							<div className="card-info">
								<span>{item.title}</span>
								<span>{item.director}</span>
							</div>
						</Link>
					);
				} else if (type === 'series' || type === render_object_type.series) {
					return (
						<Link key={index}
							  to={`/series/${item.id}`}
							  className="card">
							<ImageGenerator src={item.image}
											name={item.title}/>
							<div className="card-info">
								<span>{item.title}</span>
								<span>{item.director}</span>
							</div>
						</Link>
					);
				} else if (type === 'shows' || type === render_object_type.show) {
					return (
						<Link key={index}
							  to={`/shows/${item.id}`}
							  className="card">
							<ImageGenerator src={item.image}
											name={item.title}/>
							<div className="card-info">
								<span>{item.title}</span>
								<span>{item.director}</span>
							</div>
						</Link>
					);
				}
				return (
					<Link key={index}
						  to={`/t/${item.tagDefinitionName}/${item.id}`}
						  className="card">
						<ImageGenerator src={item.fields.image}
										name={item.value}/>
						<div className="card-info">
							<span>{item.value}</span>
							<span>{item.director}</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}

export default ListView;
