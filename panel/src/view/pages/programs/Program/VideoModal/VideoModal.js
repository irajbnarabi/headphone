import './VideoModal.scss';
import Dialog from '@material-ui/core/Dialog';
import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import Image from '../../../tags/tag-modal/Image';
import { useDispatch } from 'react-redux';
import videoActions from '../../../../../state/video/action';

const initialForm = {
	title: '',
	description: '',
	image: '',
	episodeNumber: '',
	link: '',
};

function VideoModal({ open, onClose, programType, programId, actionType, currentVideo = {} }) {
	const [form, setFormRaw] = useState(initialForm);
	const [image, setImage] = useState(null);
	const dispatch = useDispatch();

	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};

	useEffect(() => {
		if (currentVideo && JSON.stringify(currentVideo) !== '{}') {
			setFormRaw({
				title: currentVideo.title,
				description: currentVideo.description,
				image: currentVideo.image,
				episodeNumber: currentVideo.episodeNumber,
				link: currentVideo.link,
				id: currentVideo.id,
			});
		}
	}, [currentVideo]);

	useEffect(() => {
		setForm({ image: image });
	}, [image]);

	const renderForm = () => {
		const renderSeriesForm = () => {
			return (
				<>
					<TextField
						fullWidth
						label='عنوان'
						value={form.title}
						onChange={(e) => setForm({ title: e.target.value })}
						variant='outlined'
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						fullWidth
						multiline
						label='توضیحات'
						value={form.description}
						onChange={(e) => setForm({ description: e.target.value })}
						variant='outlined'
						InputLabelProps={{
							shrink: true,
						}}
					/>
					
					<TextField
						fullWidth
						type='number'
						label='شماره قسمت'
						value={form.episodeNumber}
						onChange={(e) => setForm({ episodeNumber: e.target.value })}
						variant='outlined'
						InputLabelProps={{
							shrink: true,
						}}
					/>
					{image && image.length ? <img style={{ width: '100%' }} src={image} alt={''} /> : <img style={{ width: '100%' }} src={form.image} alt={''} />}
					<Image title={'تصویر'} handleChange={(img) => setImage(img)} />
				</>
			);
		};

		return (
			<form className='video-form'>
				<TextField
					fullWidth
					label='لینک موزیک'
					value={form.link}
					onChange={(e) => setForm({ link: e.target.value })}
					variant='outlined'
					InputLabelProps={{
						shrink: true,
					}}
				/>
				{renderSeriesForm()}
			</form>
		);
	};

	const onCloseModal = () => {
		setFormRaw(initialForm);
		setImage('');
		onClose();
	};

	const handleSubmit = () => {
		if (actionType === 'CREATE') {
			dispatch(videoActions.createVideoForSpecificProgram(programId, programType, form));
		} else {
			dispatch(videoActions.editVideoForSpecificProgram(programId, programType, form));
		}
		onCloseModal();
	};

	return (
		<Dialog
			open={open}
			onClose={onCloseModal}
			classes={{
				root: 'video-modal',
				paper: 'video-modal-paper',
			}}
		>
			<b>اضافه کردن موزیک به مجموعه</b>
			<div className='mtm-content'>{renderForm()}</div>
			<div className='mtm-action'>
				<Button
					fullWidth
					variant='contained'
					color='primary'
					onClick={handleSubmit}
					disabled={ form.title === '' && form.description === ''  && form.episodeNumber === ''}
				>
					ثبت
				</Button>
			</div>
		</Dialog>
	);
}

export default VideoModal;
