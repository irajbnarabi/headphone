import './banner-tag.scss';
import React          from 'react';
import styled         from 'styled-components';
import ImageGenerator from '../../image-generator/image-generator';
import { Link }       from 'react-router-dom';

const BannerImage = styled.div`
    &:before {
    	background-image: url(${props => props.image});
    }`;

function BannerTag ({ data }) {
	const renderBannerImage = (media) => {
		if (window.innerWidth < 980) {
			return media?.banner_mobile ? media?.banner_mobile : media?.banner;
		} else {
			return media?.banner ? media?.banner : media?.image;
		}
	};

	return (
		<div className="banner-tag">
			<div className="banner-tag-container">
				<BannerImage className="banner-tag-image"
							 image={renderBannerImage(data?.fields)}/>
				<div className="banner-tag-info">
					<div className="name">{data.value}</div>
					<div className="title">{data.tagDefinitionName === 'crew' ? 'کارگردان' : data.tagDefinitionName}</div>
				</div>
				<div className="tag-content">
					{data?.items?.map((value, index) => {
						if (index < 3) {
							return (
								<Link className="tag-item"
									  to={`/movies/${value.id}`}
									  key={index}>
									<ImageGenerator src={value.image}
													name={value.title}/>
									<span className="text-truncate">{value.title}</span>
								</Link>
							);
						}
						return null;
					})}
				</div>
			</div>
		</div>
	);
}

export default BannerTag;
