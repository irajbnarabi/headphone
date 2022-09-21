import './media-carousel.scss';
import React, { useState } from 'react';
import ImageGenerator from '../../image-generator/image-generator';
import { Icon } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import GalleryDialog from '../../dialog/gallery/gallery';

function MediaCarousel ({ data, teaser }) {
	const [openGallery, setOpenGallery]   = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const handleClickItem = (item) => {
		setOpenGallery(true);
		setSelectedItem(item);
	};

	return (
		<>
			<div className="media-carousel">
				<div className="carousel-header">
					<span>گالری تصاویر</span>
				</div>
				<div className="carousel-body">
					{teaser?.map((value, index) => {
						return (
							<div className="carousel-item"
								 onClick={() => handleClickItem(value)}
								 key={index}>
								<div className="play-icon">
									<Icon component={PlayCircleOutlineIcon}/>
								</div>
								<ImageGenerator src={value?.bindings?.[ 'عکس' ]}
												isLazy={false}
												name={value?.bindings?.title}/>
							</div>
						);
					})}
					{data?.map((value, index) => {
						return (
							<div className="carousel-item"
								 onClick={() => handleClickItem(value)}
								 key={index}>
								<ImageGenerator src={value?.bindings?.image}
												isLazy={false}
												name={value?.bindings?.title}/>
							</div>
						);
					})}
				</div>
			</div>

			<GalleryDialog open={openGallery}
						   data={selectedItem}
						   onClose={() => setOpenGallery(false)}/>
		</>
	);
}

export default MediaCarousel;
