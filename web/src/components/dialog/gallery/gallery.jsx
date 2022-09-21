import './gallery.scss';
import React from 'react';
import { ModalTransition } from '../../../shared/services/general/general-service';
import Dialog from '@material-ui/core/Dialog';
import { Icon, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ImageGenerator from '../../image-generator/image-generator';

function GalleryDialog ({ open, onClose, data }) {
	return (
		<Dialog
			classes={{
				root : 'gallery-dialog',
				paper: 'gallery-dialog-paper'
			}}
			open={open}
			onClose={onClose}
			TransitionComponent={ModalTransition}>
			<div className="gallery-content">
				<div className="gallery-title">
					<b>{data?.value}</b>
					<IconButton onClick={() => onClose()}>
						<Icon component={CloseIcon}/>
					</IconButton>
				</div>
				<div className="gallery-data">
					{data?.value === 'تیزر' ? <video controls>
						<source src={data?.bindings[ 'ویدیو' ]}
								type="video/mp4"/>
						<track
							kind="captions"
							srcLang="en"
							label="english_captions"/>
					</video> : <ImageGenerator src={data?.bindings[ data?.bindings[ '0' ]?.name ]}/>}
				</div>
			</div>
		</Dialog>
	);
}

export default GalleryDialog;
