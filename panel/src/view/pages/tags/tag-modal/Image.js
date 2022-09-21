import './TagModal.scss';
import React, { useEffect, useState } from 'react';
import { UID } from 'react-uid';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import fileActions from '../../../../state/file/action';

function Image({ title, handleChange }) {
	const [image, setImage] = useState(null);
	const dispatch = useDispatch();
	const [id, setId] = useState('');

	useEffect(() => {
		dispatch(fileActions.resetFile(id));
	}, [id]);

	const reducerFile = useSelector((state) => state.fileReducer[id]);

	useEffect(() => {
		if (image && id) {
			dispatch(fileActions.uploadImage({ file: image }, id));
		}
	}, [image]);

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
						accept='image/*'
						type='file'
						onChange={(event) => {
							setImage(event.target.files[0]);
							setId(id);
						}}
					/>
				</>
			)}
		</UID>
	);
}

export default Image;
