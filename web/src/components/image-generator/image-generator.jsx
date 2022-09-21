import './image-generator.scss';
import React             from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function ImageGenerator ({ src, name, isLazy = true }) {
	if (isLazy) {
		return (
			<LazyLoadImage
				src={src}
				width="100%"
				height="100%"
				alt={name}
				title={name}
				effect="blur"
				name={name}/>
		);
	}
	return (
		<img src={src}
			 alt={name}
			 title={name}
			 width={100}
			 height={100}/>
	);
}
