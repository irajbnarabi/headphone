import * as configs           from '../../shared/services/general/configs';
import Carousel               from '../carousel/carousel';
import Banner                 from '../banner/banner';
import Horizontal             from '../horizontal/horizontal';
import Vertical               from '../vertical/vertical';
import React                  from 'react';
import { render_object_type } from '../../shared/services/general/configs';

function BaseEntity ({ data, baseUrl = 'movies' }) {
	return data.map((value, index) => {
		if (value.render.type === configs.render_type.carousel) {
			return (
				<div key={index}>
					<Carousel data={value}/>
					{value?.render?.objectType === render_object_type.tag ? null : <hr className="dark-custom-hr"/>}
				</div>
			);
		}
		if (value.render.type === configs.render_type.banner) {
			return (
				<Banner key={index}
						data={value}/>
			);
		}
		if (value.render.type === configs.render_type.horizontal) {
			return (
				<Horizontal key={index}
							baseUrl={baseUrl}
							data={value}/>
			);
		}
		if (value.render.type === configs.render_type.vertical) {
			return (
				<Vertical key={index}
						  baseUrl={baseUrl}
						  data={value}/>
			);
		}
		return (
			<div key={index}/>
		);
	});
}

export default BaseEntity;
