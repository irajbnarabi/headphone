import './horizontal-program.scss';
import React          from 'react';
import TripleCarousel from '../../carousel/triple/triple-carousel';

function HorizontalProgram ({ data, baseUrl }) {

	return (
		<div className="horizontal-movie">
			<div>
				<div className="horizontal-header">
					<span>{data.title}</span>
				</div>
				<hr className="light-custom-hr"/>
				<div className="horizontal-body">
					<TripleCarousel data={data.objects}
									moreTitle={data.moreTitle}
									baseUrl={baseUrl}/>
				</div>
			</div>
		</div>
	);
}

export default HorizontalProgram;
