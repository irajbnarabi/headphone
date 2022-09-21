import './TagModal.scss';
import React, { useEffect, useState } from 'react';
import { UID } from 'react-uid';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import fileActions from '../../../../state/file/action';

function VideoUploader({ title, handleChange }) {
	const [video, setVideo] = useState(null);
	const [id, setId] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fileActions.resetFile(id));
	}, [id]);

	const reducerFile = useSelector((state) => state.fileReducer[id]);

	useEffect(() => {
		if (video && id) {
			dispatch(fileActions.uploadVideo({ file: video }, id));
		}
	}, [video]);

	useEffect(() => {
		if (reducerFile?.file && !reducerFile.loading && !reducerFile.error) {
			handleChange(reducerFile.file);
			fileActions.resetFile(id);
		}
	}, [reducerFile]);

	return (
		<UID name={(id) => `upload-program-image-${id}`}>
			{(id) => (
				<>
					<label htmlFor={id}>
						<Button fullWidth component='span' variant='contained' color='primary'>
							{reducerFile?.loading ? <CircularProgress size={25} color='inherit' /> : <>{`انتخاب ${title}`}</>}
						</Button>
					</label>
					<input
						id={id}
						className='no-display'
						name='programImage'
						accept='video/*'
						type='file'
						onChange={(event) => {
							setVideo(event.target.files[0]);
							setId(id);
						}}
					/>
				</>
			)}
		</UID>
	);
}

export default VideoUploader;
