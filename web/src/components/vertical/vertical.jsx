import './vertical.scss';
import React                  from 'react';
import { render_object_type } from '../../shared/services/general/configs';
import VerticalProgram        from './program/vertical-program';
import VerticalTag            from './tag/vertical-tag';

export default function Vertical ({ data, baseUrl }) {

	const renderVerticalProgram = () => {
		return (
			<VerticalProgram data={data} baseUrl={baseUrl}/>
		);
	};

	const renderVerticalTag   = () => {
		return (
			<VerticalTag data={data}/>
		);
	};

	return (
		<div>
			{data.render.objectType === render_object_type.movie || data.render.objectType === render_object_type.series ? renderVerticalProgram() : renderVerticalTag()}
		</div>
	);
}
