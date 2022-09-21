import './carousel.scss';
import React                  from 'react';
import { render_object_type } from '../../shared/services/general/configs';
import TagCarousel            from './tag/tag-carousel';
import ProgramCarousel        from './program/program-carousel';

function Carousel ({ data }) {
	const renderProgramCarousel = () => data.objects.length ? <ProgramCarousel data={data}
																			  type={data.render.objectType}/> : null;

	const renderTagCarousel = () => data.objects.length ? <TagCarousel data={data}/> : null;

	return (
		<div>
			{data?.render?.objectType === render_object_type.movie ? renderProgramCarousel() :
				data?.render?.objectType === render_object_type.series ? renderProgramCarousel() :
					data?.render?.objectType === render_object_type.tag ? renderTagCarousel() : null}
		</div>
	);
}

export default Carousel;
