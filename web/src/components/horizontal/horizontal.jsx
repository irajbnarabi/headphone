import './horizontal.scss';
import React                  from 'react';
import { render_object_type } from '../../shared/services/general/configs';
import HorizontalProgram      from './program/horizontal-program';
import HorizontalTag          from './tag/horizontal-tag';

function Horizontal ({ data, baseUrl }) {

	const renderHorizontalProgram = () => {
		return (
			<HorizontalProgram data={data} baseUrl={baseUrl}/>
		);
	};
	const renderHorizontalTag   = () => {
		return (
			<HorizontalTag data={data}/>
		);
	};

	return (
		<div>
			{data.render.objectType === render_object_type.movie || data.render.objectType === render_object_type.series ? renderHorizontalProgram() : renderHorizontalTag()}
		</div>
	);
}

export default Horizontal;
