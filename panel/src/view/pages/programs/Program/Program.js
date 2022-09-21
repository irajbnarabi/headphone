import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { UID } from 'react-uid';
import './Program.scss';
import ProgramTag from './ProgramTag/ProgramTag';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ProgramTagModal from './ProgramTagModal/ProgramTagModal';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Loading from '../../../components/loading/loading';
import VideoModal from './VideoModal/VideoModal';
import defaultImageOfSeasons from '../../../../assets/images/default.jpg';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import Card from '@material-ui/core/Card';
import programActions from '../../../../state/program/action';
import videoActions from '../../../../state/video/action';

const initialForm = {
	title: '',
	description: '',
	image: '',
	tags: {},
};

function Program() {
	const { type } = useParams();
	const { id } = useParams();
	const dispatch = useDispatch();
	const { currentProgram, currentImage, imageLoading } = useSelector((state) => state.programReducer);
	const submitForm = (form) => {
		if (id) {
			dispatch(programActions.updateProgram(type, id, form));
		} else {
			dispatch(programActions.createProgram(type, form));
		}
	};
	const editMode = Boolean(id);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (id !== currentProgram?.id) {
			dispatch(programActions.resetCurrentProgram());
		}
		if (id) {
			if (!currentProgram) {
				dispatch(programActions.getProgramDetails(type, id));
			}
		}
	}, [currentProgram, id, type]);

	useEffect(() => {
		if (currentProgram) {
			setChecked(currentProgram.enabled);
		}
	}, [currentProgram]);

	const [form, setFormRaw] = useState({ ...(currentProgram || initialForm) });
	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};
	const [image, setImage] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (currentProgram) {
			setFormRaw({
				title: currentProgram.title,
				description: currentProgram.description,
				image: currentProgram.image,
			});
		} else {
			setFormRaw(initialForm);
		}
	}, [currentProgram]);

	useEffect(() => {
		if (image) {
			dispatch(programActions.uploadProgramImage({ file: image }));
		}
	}, [image]);

	useEffect(() => {
		if (currentImage) {
			setForm({ image: currentImage });
		}
	}, [currentImage]);

	const handleSubmit = async () => {
		await submitForm(form);
	};

	const renderUploadImage = () => (
		<UID name={(id) => `upload-program-image-${id}`}>
			{(id) => (
				<>
					<label htmlFor={id}>
						<Button style={{ marginBottom: '10px' }} fullWidth component='span' variant='contained' color='primary'>
							{imageLoading ? <CircularProgress size={25} color='inherit' /> : <>{image?.name || 'آپلود تصویر'}</>}
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
						}}
					/>
				</>
			)}
		</UID>
	);

	const renderTagModal = () => {
		return (
			<ProgramTagModal
				actionType={'create'}
				open={openModal}
				onClose={() => setOpenModal(false)}
				action={(chosenTag) => dispatch(programActions.updateProgramTags(type, currentProgram.id, chosenTag.id, chosenTag.bindings))}
			/>
		);
	};

	const renderTags = () => {
		const programTags = Object.entries(currentProgram?.tags || {}).reduce((result, [tagDef, tags]) => [...result, ...tags.reduce((res, tag) => [...res, { ...tag, tagDef }], [])], []);
		const tagsCategory = [];
		programTags.forEach((tag) => {
			const found = tagsCategory.some((el) => el.title === tag.tagDef);
			if (!found) {
				const tagData = {
					title: tag.tagDef,
					data: [tag],
				};
				tagsCategory.push(tagData);
			} else {
				tagsCategory.forEach((category) => {
					if (category.title === tag.tagDef) {
						category.data.push(tag);
					}
				});
			}
		});

		return (
			<>
				<Button disabled={!id} className='add-tag-btn' variant={'contained'} onClick={() => setOpenModal(true)}>
					<span>اضافه کردن تگ</span>
					<IconButton size={'small'} disabled={!id}>
						<AddIcon />
					</IconButton>
				</Button>
				<div className='tags-list'>
					{tagsCategory.map((value, index) => {
						return (
							<div key={index}>
								<span>{value.title}</span>
								<hr />
								<div className='program-tags'>
									{value.data.map((tag, index) => (
										<ProgramTag key={index} type={type} tag={tag} programId={currentProgram?.id} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			</>
		);
	};

	const renderForm = () => (
		<div className='program-form'>
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
				label='توضیح'
				value={form.description}
				onChange={(e) => setForm({ description: e.target.value })}
				variant='outlined'
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<img src={form.image} alt={form.image} />
			{renderUploadImage()}
		</div>
	);

	const renderActions = () => (
		<div className='program-action'>
			<Button variant='contained' color='primary' onClick={handleSubmit}>
				{editMode ? 'ثبت تغییرات' : 'ایجاد'}
			</Button>
		</div>
	);

	const renderDisableOrEnableProgram = () => {
		const toggleChecked = () => {
			setChecked((prev) => !prev);
			dispatch(programActions.enableOrDisableProgram(id, type, !checked));
		};

		return (
			<div className='program-is-enable'>
				<FormControlLabel control={<Switch checked={checked} onChange={toggleChecked} name='checkedB' color='primary' />} label='فعال کردن برنامه' />
			</div>
		);
	};

	const [openVideoModal, setOpenVideoModal] = useState(false);
	const [openDeleteVideoModal, setOpenDeleteVideoModal] = useState(false);
	const [selectEpisodeOfSeason, setSelectEpisodeOfSeason] = useState(null);
	const [actionTypeOfVideoOfProgramModal, setActionTypeOfVideoOfProgramModal] = useState('CREATE');

	const renderVideoOfProgram = () => {
		return (
			<div>
				<Button
					disabled={!id }
					className='add-video-btn'
					variant={'contained'}
					onClick={() => {
						setOpenVideoModal(true);
						setSelectEpisodeOfSeason(null);
						setActionTypeOfVideoOfProgramModal('CREATE');
					}}
				>
					<span>اضافه کردن موزیک</span>
					<IconButton size={'small'} disabled={!id}>
						<AddIcon />
					</IconButton>
				</Button>
			</div>
		);
	};

	const renderVideoOfProgramModal = () => (
		<VideoModal
			open={openVideoModal}
			programType={type}
			programId={id}
			currentVideo={selectEpisodeOfSeason}
			actionType={actionTypeOfVideoOfProgramModal}
			onClose={() => setOpenVideoModal(false)}
		/>
	);

	const renderDeleteVideoOfProgramModal = () => (
		<ConfirmModal
			open={openDeleteVideoModal}
			onClose={() => setOpenDeleteVideoModal(false)}
			action={() => dispatch(videoActions.deleteVideoForSpecificProgram(id, type, selectEpisodeOfSeason.id))}
		/>
	);

	const renderSeasonsOfProgram = () => {
		const editEpisodeOfSeason = (episode) => {
			setSelectEpisodeOfSeason(episode);
			setOpenVideoModal(true);
			setActionTypeOfVideoOfProgramModal('EDIT');
		};

		const removeEpisodeOfSeason = (episode) => {
			setSelectEpisodeOfSeason(episode);
			setOpenDeleteVideoModal(true);
		};

		return (
			<Card className={`seasons-of-program ${'seasons-of-movies'}`}>
				{Object.entries(currentProgram?.seasons).map(([key, value], index) => {

						return (
							<div key={index} className='seasons'>
								<div className='season-header'>
									<span> فصل </span>
									<span> {key} </span>
								</div>
								<div className='season-box'>
									{value.map((episode, index1) => {
										return (
											<div key={index1}>
												<img src={episode?.image ? episode.image : defaultImageOfSeasons} alt={episode?.title ? episode?.title : ''} />
												<div>
													<span>قسمت </span>
													<span>{episode?.episodeNumber}</span>
												</div>
												<div className='episode-title'>{episode?.title}</div>
												<div className='operations'>
													<IconButton aria-label='delete' color={'secondary'} onClick={() => removeEpisodeOfSeason(episode)}>
														<DeleteIcon fontSize='small' />
													</IconButton>
													<IconButton aria-label='edit' color={'secondary'} onClick={() => editEpisodeOfSeason(episode)}>
														<EditIcon fontSize='small' />
													</IconButton>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);

				})}
			</Card>
		);
	};

	const renderShowInSite = () => (
		<a href={`https://vidosign.com/${type}/${id}`} style={{ display: 'inline-block', color: 'black', textDecoration: 'underline' }} target='_blank'>
			<span>
				<span>مشاهده</span>
				<span> {currentProgram?.title} </span>
				<span>در سایت</span>
			</span>
		</a>
	);

	if (!currentProgram && editMode) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className='program'>
				{renderForm()}
				{renderActions()}
				{editMode ? renderShowInSite() : null}
				{renderDisableOrEnableProgram()}
				{renderVideoOfProgramModal()}
				{renderVideoOfProgram()}
				{editMode && Object.keys(currentProgram?.seasons) && Object.keys(currentProgram?.seasons).length ? (
					<>
						{renderSeasonsOfProgram()}
						{openDeleteVideoModal && renderDeleteVideoOfProgramModal()}
					</>
				) : null}
				{renderTagModal()}
				{renderTags()}
			</div>
		</Layout>
	);
}

export default Program;
