import React                  from 'react';
import { render_object_type } from '../../shared/services/general/configs';
import BannerTag              from './tag/banner-tag';
import BannerProgram          from './program/banner-program';

function Banner ({ data }) {

	const renderBannerProgram = () => <BannerProgram data={data.objects[ 0 ]}
													 type={data.render.objectType}/>;

	const renderBannerTag = () => <>
		<BannerTag data={data.objects[ 0 ]}/>
		<hr className="dark-custom-hr"/>
	</>;

	return data.render.objectType === render_object_type.movie ? renderBannerProgram() :
		data.render.objectType === render_object_type.series ? renderBannerProgram() :
			data.render.objectType === render_object_type.tag ? renderBannerTag() : null;
}

export default Banner;
