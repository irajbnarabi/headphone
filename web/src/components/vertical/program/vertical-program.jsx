import './vertical-program.scss';
import LinearCarousel from '../../carousel/linear/linear-carousel';
import React          from 'react';

export default function VerticalProgram ({ data, baseUrl }) {
	return (
		<div className="vertical-movie">
			<div>
				<div className="vertical-header">
					<span>{data.title}</span>
				</div>
				<hr className="light-custom-hr"/>
				<div className="vertical-body">
					{data.objects.map((value, index) => {
						return (
							<div key={index}>
								<LinearCarousel data={value}
												itemSubUrl={baseUrl}/>
								<hr className="light-custom-hr"/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
