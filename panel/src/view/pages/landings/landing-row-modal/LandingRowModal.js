import './LandingRowModal.scss';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, IconButton, Menu, MenuItem, TextField } from '@material-ui/core';
import { renderObjectType, renderType } from './RowRenderTypes';
import { useDispatch, useSelector } from 'react-redux';
import FillValueRenderer from './FillValueRenderer';
import { Delete } from '@material-ui/icons';
import programActions from '../../../../state/program/action';
import tagActions from '../../../../state/tag/action';

const initialForm = {
	title: '',
	renderType: '',
	renderObjectType: '',
	renderFillValue: '',
};

function LandingRowModal({ data, mode, action, onClose, open, type }) {
	const [form, setFormRaw] = useState(initialForm);
	const [openRenderTypeMenu, setOpenRenderTypeMenu] = useState(null);
	const [openRenderObjectTypeMenu, setOpenRenderObjectTypeMenu] = useState(null);
	const { tagList } = useSelector((state) => state.tagReducer);
	const { programs } = useSelector((state) => state.programReducer);
	const [searchQuery, setSearchQuery] = useState('');
	const [chosenTag, setChosenTag] = useState(null);
	const [chosenProgram, setChosenProgram] = useState(null);
	const [multiCarouselObjects, setMultiCarouselObjects] = useState(data?.objects ? data.objects : []);
	const dispatch = useDispatch();
	const [chosenObjectData1, setChosenObjectData1] = useState(multiCarouselObjects[0]);
	const [chosenObjectData2, setChosenObjectData2] = useState(multiCarouselObjects[1]);
	const [chosenObjectData3, setChosenObjectData3] = useState(multiCarouselObjects[2]);
	const [chosenObjectData4, setChosenObjectData4] = useState(multiCarouselObjects[3]);

	const setForm = (keyVal) => {
		setFormRaw({ ...initialForm, ...form, ...keyVal });
	};

	useEffect(() => {
		if (open) {
			if (mode === 'UPDATE') {
				setFormRaw({
					title: data.title,
					renderType: data.render.type,
					renderObjectType: data.render.objectType,
					renderFillValue: data.render.fillValue,
				});
				setMultiCarouselObjects(data?.objects ? data.objects : []);
			} else {
				setFormRaw(initialForm);
				setMultiCarouselObjects([]);
			}
		}
	}, [open]);

	useEffect(() => {
		if (open) {
			dispatch(tagActions.searchTag(searchQuery));
			dispatch(programActions.searchProgram(type, searchQuery));
		}
	}, [open, searchQuery]);

	useEffect(() => {
		if (open) {
			if (form.renderType === renderType.horizontal || form.renderType === renderType.vertical) {
				setFormRaw({
					title: form.title,
					renderType: form.renderType,
					renderObjectType: type === 'albums' ? renderObjectType.album : renderObjectType.playlist,
					renderFillValue: 'latest',
				});
			}
		}
	}, [open, form.renderType]);

	useEffect(() => {
		if (open) {
			if (chosenTag) {
				setForm({ renderFillValue: chosenTag.id });
			}
		}
	}, [open, chosenTag]);

	useEffect(() => {
		if (open) {
			if (chosenProgram) {
				setForm({ renderFillValue: chosenProgram.id });
			}
		}
	}, [open, chosenProgram]);

	useEffect(() => {
		if (open) {
			const temp = [...multiCarouselObjects];
			if (chosenObjectData1 !== temp[0]) {
				temp[0] = chosenObjectData1 && chosenObjectData1.title ? chosenObjectData1 : null;
			}
			if (chosenObjectData2 !== temp[1]) {
				temp[1] = chosenObjectData2 && chosenObjectData2.title ? chosenObjectData2 : null;
			}
			if (chosenObjectData3 !== temp[2]) {
				temp[2] = chosenObjectData3 && chosenObjectData3.title ? chosenObjectData3 : null;
			}
			if (chosenObjectData4 !== temp[3]) {
				temp[3] = chosenObjectData4 && chosenObjectData4.title ? chosenObjectData4 : null;
			}
			setMultiCarouselObjects(temp.filter((value) => value));
		}
	}, [open, chosenObjectData1, chosenObjectData2, chosenObjectData3, chosenObjectData4]);

	useEffect(() => {
		if (open) {
			if (form.renderType === renderType.carousel && form.renderObjectType === renderObjectType.tag) {
				setForm({ renderFillValue: '5f64a7675b6ca7616e9fbaa3' });
			}
		}
	}, [open, form.renderType, form.renderObjectType]);

	const handleSubmit = () => {
		action(form, multiCarouselObjects);
		setFormRaw(initialForm);
		setMultiCarouselObjects([]);
		onClose();
	};

	const handleTitle = () => {
		if (form.renderType && form.renderType.length) {
			return (
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
			);
		}
		return null;
	};

	const handleRenderType = () => {
		const handleClick = (event) => {
			setOpenRenderTypeMenu(event.currentTarget);
		};

		const handleMenuItemClick = (selectedRenderType) => {
			setForm({ renderType: selectedRenderType });
			setOpenRenderTypeMenu(null);
		};

		const handleClose = () => {
			setOpenRenderTypeMenu(null);
		};

		return (
			<div>
				<span>انتخاب نوع نمایش : </span>
				<Button aria-controls='simple-menu' aria-haspopup='true' variant={'contained'} onClick={handleClick}>
					{mode === 'UPDATE' ? form.renderType : form.renderType && form.renderType.length ? form.renderType : 'انتخاب نوع نمایش'}
				</Button>
				<Menu id='simple-menu' anchorEl={openRenderTypeMenu} keepMounted open={Boolean(openRenderTypeMenu)} onClose={handleClose}>
					{Object.values(renderType).map((value, index) => (
						<MenuItem onClick={() => handleMenuItemClick(value)} key={index}>
							{value}
						</MenuItem>
					))}
				</Menu>
			</div>
		);
	};

	const handleRenderObjectType = () => {
		const handleClick = (event) => {
			setOpenRenderObjectTypeMenu(event.currentTarget);
		};

		const handleMenuItemClick = (selectedRenderObjectType) => {
			setForm({ renderObjectType: selectedRenderObjectType });
			setOpenRenderObjectTypeMenu(null);
		};

		const handleClose = () => {
			setOpenRenderObjectTypeMenu(null);
		};

		const renderMenuItems = (value, index) => {
			if (type === 'albums') {
				return value === renderObjectType.album || value === renderObjectType.tag ? (
					<MenuItem onClick={() => handleMenuItemClick(value)} key={index}>
						{value}
					</MenuItem>
				) : null;
			} else if (type === 'playlists') {
				return value === renderObjectType.playlist || value === renderObjectType.tag ? (
					<MenuItem onClick={() => handleMenuItemClick(value)} key={index}>
						{value}
					</MenuItem>
				) : null;
			}
			return <span>{value}</span>;
		};

		if (form.renderType && form.renderType.length > 0) {
			return (
				<div>
					<span>انتخاب نوع نمایش آیتم‌ها : </span>
					<Button aria-controls='simple-menu' aria-haspopup='true' variant={'contained'} onClick={handleClick}>
						{mode === 'UPDATE' ? form.renderObjectType : form.renderObjectType && form.renderObjectType.length ? form.renderObjectType : 'انتخاب نوع نمایش آیتم‌ها'}
					</Button>
					<Menu id='simple-menu' anchorEl={openRenderObjectTypeMenu} keepMounted open={Boolean(openRenderObjectTypeMenu)} onClose={handleClose}>
						{Object.values(renderObjectType).map((value, index) => renderMenuItems(value, index))}
					</Menu>
				</div>
			);
		}
		return null;
	};

	const handleRenderFillValue = (objectType, fillValue, chooseTagAction, chooseProgramAction) => (
		<FillValueRenderer
			objectType={objectType}
			tagList={tagList}
			programs={programs}
			currentFillValue={fillValue}
			setTagValue={chooseTagAction}
			setProgramValue={chooseProgramAction}
			searchAction={(e, value) => setSearchQuery(value)}
		/>
	);

	const handleObjects = () => {
		const createObjectFromSelectedTag = (tag, order) => {
			if (tag && tag?.value) {
				return {
					title: tag.value,
					order: order,
					deepLink: `/t/${tag.tagDefinitionName}/${tag.id}/${type}`,
					render: {
						type: renderType.carousel,
						objectType: type === 'albums' ? renderObjectType.album : renderObjectType.playlist,
						fillValue: tag.id,
					},
				};
			}
		};

		if ((form.renderType === renderType.horizontal || form.renderType === renderType.vertical) && form.renderObjectType && form.renderObjectType.length) {
			return (
				<div>
					<h3>داده‌های کروسل‌های داخلی</h3>
					<div className='show-object'>
						<div>
							<div className='object-header'>
								<h4>
									<span>کروسل اول</span>
									<span> | </span>
									<span>{chosenObjectData1?.title}</span>
								</h4>
								<IconButton aria-label='delete' onClick={() => setChosenObjectData1({})}>
									<Delete />
								</IconButton>
							</div>
							{handleRenderFillValue(renderObjectType.tag, chosenObjectData1?.render?.fillValue, (e, value) => setChosenObjectData1(createObjectFromSelectedTag(value, 1)))}
						</div>
						<div>
							<div className='object-header'>
								<h4>
									<span>کروسل دوم</span>
									<span> | </span>
									<span>{chosenObjectData2?.title}</span>
								</h4>
								<IconButton aria-label='delete' onClick={() => setChosenObjectData2({})}>
									<Delete />
								</IconButton>
							</div>
							{handleRenderFillValue(renderObjectType.tag, chosenObjectData2?.render?.fillValue, (e, value) => setChosenObjectData2(createObjectFromSelectedTag(value, 2)))}
						</div>
						<div>
							<div className='object-header'>
								<h4>
									<span>کروسل سوم</span>
									<span> | </span>
									<span>{chosenObjectData3?.title}</span>
								</h4>
								<IconButton aria-label='delete' onClick={() => setChosenObjectData3({})}>
									<Delete />
								</IconButton>
							</div>
							{handleRenderFillValue(renderObjectType.tag, chosenObjectData3?.render?.fillValue, (e, value) => setChosenObjectData3(createObjectFromSelectedTag(value, 3)))}
						</div>
						<div>
							<div className='object-header'>
								<h4>
									<span>کروسل چهارم</span>
									<span> | </span>
									<span>{chosenObjectData4?.title}</span>
								</h4>
								<IconButton aria-label='delete' onClick={() => setChosenObjectData4({})}>
									<Delete />
								</IconButton>
							</div>
							{handleRenderFillValue(renderObjectType.tag, chosenObjectData4?.render?.fillValue, (e, value) => setChosenObjectData4(createObjectFromSelectedTag(value, 4)))}
						</div>
					</div>
				</div>
			);
		}
		return null;
	};

	const renderForm = () => {
		return (
			<form className='row-form'>
				{handleRenderType()}
				{form.renderType === renderType.carousel || form.renderType === renderType.banner ? handleRenderObjectType() : null}
				{handleTitle()}
				{form.renderType === renderType.carousel && form.renderObjectType === renderObjectType.tag ? null : (
					<>
						{form.renderType === renderType.carousel && (form.renderObjectType === renderObjectType.playlist || form.renderObjectType === renderObjectType.album) ? (
							handleRenderFillValue(
								renderObjectType.tag,
								form.renderFillValue,
								(e, value) => setChosenTag(value),
								(e, value) => setChosenProgram(value)
							)
						) : (
							<>
								{form.renderType === renderType.carousel || form.renderType === renderType.banner
									? handleRenderFillValue(
											form.renderObjectType,
											form.renderFillValue,
											(e, value) => setChosenTag(value),
											(e, value) => setChosenProgram(value)
									  )
									: null}
								{handleObjects()}
							</>
						)}
					</>
				)}

				<Button fullWidth variant='contained' color='primary' onClick={handleSubmit} disabled={false}>
					ثبت
				</Button>
			</form>
		);
	};

	if (open) {
		return (
			<Dialog
				classes={{
					root: 'landing-row-modal',
					paper: 'landing-row-modal-paper',
				}}
				onClose={onClose}
				aria-labelledby='simple-dialog-title'
				open={open}
			>
				<DialogTitle id='simple-dialog-title'>{mode === 'CREATE' ? 'اضافه کردن ردیف' : 'ویرایش کردن ردیف'}</DialogTitle>
				{renderForm()}
			</Dialog>
		);
	}

	return null;
}

export default LandingRowModal;
