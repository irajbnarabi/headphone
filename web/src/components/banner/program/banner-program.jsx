import './banner-program.scss';
import React                  from 'react';
import styled                 from 'styled-components';
import StarIcon               from '@material-ui/icons/Star';
import { Icon }               from '@material-ui/core';
import ImageGenerator         from '../../image-generator/image-generator';
import { render_object_type } from '../../../shared/services/general/configs';
import { Link }               from 'react-router-dom';

const BannerImage = styled.div`
    &:before {
		background-image: url(${props => props.image});
    }`;

function BannerMovie ({ data, type }) {
	const renderCrewTags = () => {
		return data?.tags?.crew?.map((value, index) => {
			if (index < 3) {
				return (
					<div key={index}>
						{value.bindings.role[ 0 ] === 'کارگردان' ? <><span>{value[ 'bindings' ][ 'role' ]}</span><span> : </span></> : null}
						<span>{value.value}</span>
					</div>
				);
			}
			return null;
		});
	};

	const renderBannerInfo = () => <div className="more-info">
		<div>
			{data?.tags?.genre ? <ul className="genres">
				{data?.tags?.genre.map((item, index) => <li key={index}>{item.value}</li>)}
			</ul> : null}
			<div className="rate">
				<Icon component={StarIcon}/>
				<span>{data?.tags?.[ 'imdb-rate' ] ? data?.tags?.[ 'imdb-rate' ][ 0 ]?.bindings?.rate : null}</span>
			</div>
			<div>
				<span>{data?.tags?.[ 'time-info' ] ? data?.tags?.[ 'time-info' ][ 0 ]?.bindings?.duration : null}</span>
			</div>
			<div>
				<span>{data?.tags?.[ 'production-year' ] ? data?.tags?.[ 'production-year' ][ 0 ]?.bindings?.year : null}</span>
			</div>
			<div className="restriction">
				<span>{data?.tags?.[ 'pg' ] ? data?.tags?.[ 'pg' ][ 0 ]?.bindings?.age : null}</span>
			</div>
		</div>
	</div>;

	const renderBannerImage = (media) => {
		if (window.innerWidth < 980) {
			return media?.value === 'banner_mobile' ? media?.bindings?.image : '';
		} else {
			return media?.value === 'banner' ? media?.bindings?.image : '';
		}
	};

	return (
		<Link to={`/${type === render_object_type.movie ? 'movies' : type === render_object_type.series ? 'series' : 'shows'}/${data.id}`}>
			<BannerImage className="banner-program"
						 image={data?.tags?.media?.map((item) => renderBannerImage(item))}>
				<div className="cover-image">
					<ImageGenerator src={data.image}
									name={data.title}/>
				</div>
				<div className="banner-info-mobile">
					<div className="banner-info">
						<div className="banner-title">{data.title}</div>
						{type === render_object_type.movie ? <div className="actors-director">{renderCrewTags()}</div> : null}
					</div>
					{renderBannerInfo()}
				</div>
				<div className="banner-info-desktop">
					<div>
						<h2>{data.title}</h2>
					</div>
					<div className="banner-info">
						<div className="main-info">
							<p>{data.description.length > 90 ? `${data.description.substring(0, 90)}...` : data.description}</p>
							{renderBannerInfo()}
						</div>
						<div className="crew-section">
							{renderCrewTags()}
						</div>
					</div>
				</div>
			</BannerImage>
		</Link>
	);
}

export default BannerMovie;
