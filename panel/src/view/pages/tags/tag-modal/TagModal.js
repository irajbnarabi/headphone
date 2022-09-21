import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import JalaliUtils from '@date-io/jalaali';
import jMoment from 'moment-jalaali';
import moment from 'moment';
import './TagModal.scss';
import tagActions from '../../../../state/tag/action';
import Image from './Image';
import subscriptionActions from '../../../../state/subscription/action';
import VideoUploader from './VideoUploader';

function TagModal({ open, onClose, actionMode, currentTag, tagDefinitionList, currentPage = 1 }) {
	const dispatch = useDispatch();
	const [selectTD, setSelectTD] = useState(null);
	const [value, setValue] = useState('');
	const [fields, setFields] = useState(null);
	const { plans } = useSelector((state) => state.subscriptionReducer);

	jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

	useEffect(() => {
		if (actionMode !== 'CREATE') {
			setSelectTD(tagDefinitionList.find((td) => td.id === currentTag.tagDefinitionId) || null);
			setValue(currentTag.value || '');
			setFields(currentTag.fields || null);
		}
	}, [actionMode, currentTag, tagDefinitionList]);

	useEffect(() => {
		if (open) {
			dispatch(subscriptionActions.getPlans('ticket'));
		}
	}, [open]);

	useEffect(() => {
		if (actionMode === 'CREATE') {
			setFields(selectTD?.fields?.reduce((result, item) => ({ ...result, [item.name]: '' }), {}));
		}
	}, [selectTD, actionMode]);

	const action = () => {
		if (!!selectTD && !!value) {
			const data = {
				tagDefinitionId: selectTD.id,
				value,
				fields: fields,
			};
			actionMode === 'CREATE' ? dispatch(tagActions.createTag(data, currentPage)) : dispatch(tagActions.updateTag(data, currentTag.id, currentPage));
			onClose();
		}
	};

	function RenderDateSelector({ onChange, label, firstValue }) {
		return (
			<MuiPickersUtilsProvider utils={JalaliUtils} locale='fa'>
				<DatePicker
					inputVariant='outlined'
					fullWidth
					label={label}
					clearable
					okLabel='تأیید'
					cancelLabel='لغو'
					clearLabel='پاک کردن'
					labelFunc={(value) => (value ? value.format('jYYYY/jMM/jDD') : '')}
					value={moment.unix(firstValue)}
					onChange={(value) => onChange(value?.unix())}
				/>
			</MuiPickersUtilsProvider>
		);
	}

	const renderSelectTagDefinition = () => {
		return (
			<FormControl fullWidth disabled={actionMode !== 'CREATE'} className='select-type' variant='outlined'>
				<InputLabel>انتخاب مشخصات تگ‌ها</InputLabel>
				<Select value={selectTD} onChange={(e) => setSelectTD(e.target.value)} label='انتخاب مشخصات تگ‌ها'>
					{tagDefinitionList?.map((td, index) => (
						<MenuItem key={index} value={td}>
							{td?.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	return (
		<Dialog
			open={open}
			classes={{
				root: 'tag-modal',
				paper: 'tag-modal-paper',
			}}
			onClose={onClose}
		>
			<b>{actionMode === 'CREATE' ? 'ایجاد تگ' : 'ویرایش تگ'}</b>
			{renderSelectTagDefinition()}
			{selectTD ? (
				<>
					<TextField fullWidth value={value} onChange={(e) => setValue(e.target.value)} required label='مقدار' variant='outlined' />
					{selectTD.fields?.map((field, index) => {
						if (['TEXT', 'NUMBER', 'UNIQUE'].includes(field.type)) {
							return (
								<TextField
									fullWidth
									key={index}
									value={fields?.[field?.name] || ''}
									onChange={(e) => setFields({ ...fields, [field.name]: field.type === 'NUMBER' ? +e.target.value : e.target.value })}
									label={field?.name}
									variant='outlined'
									inputProps={{
										type: field.type === 'NUMBER' ? 'number' : 'text',
									}}
								/>
							);
						}
						if (field.type === 'MULTILINE') {
							return (
								<TextField
									fullWidth
									key={index}
									multiline
									value={fields?.[field?.name] || ''}
									onChange={(e) => setFields({ ...fields, [field.name]: e.target.value })}
									label={field?.name}
									variant='outlined'
									inputProps={{
										type: field.type === 'NUMBER' ? 'number' : 'text',
									}}
								/>
							);
						}
						if (field.type === 'DATE') {
							return <RenderDateSelector key={index} firstValue={fields?.[field?.name] || ''} label={field?.name} onChange={(date) => setFields({ ...fields, [field?.name]: date })} />;
						}
						if (field.type === 'IMAGE') {
							return (
								<div key={index}>
									<p>{field?.name}</p>
									<img style={{ width: '100%' }} src={fields?.[field?.name]} alt={''} />
									<Image key={field} title={field?.name} handleChange={(img) => setFields({ ...fields, [field.name]: img })} />
								</div>
							);
						}
						if (field.type === 'VIDEO') {
							return (
								<div key={index}>
									<p>{field?.name}</p>
									{fields[field.name] ? (
										<video width='400' controls>
											<source src={fields[field.name]} type='video/mp4' />
											<track kind='captions' srcLang='en' label='english_captions' />
										</video>
									) : null}
									<VideoUploader key={field} title={field?.name} handleChange={(video) => setFields({ ...fields, [field.name]: video })} />
								</div>
							);
						}
						if (field.type === 'TICKET') {
							return (
								<FormControl fullWidth key={index} className='select-type' variant='outlined'>
									<InputLabel>{field.name}</InputLabel>
									<Select
										value={typeof fields[field.name] === 'string' ? [fields[field.name]] : fields[field.name] || []}
										onChange={(event) => setFields({ ...fields, [field.name]: event.target.value })}
										label={field.name}
									>
										{plans?.map((plan) => (
											<MenuItem key={plan} value={plan.id}>
												<span style={{ display: 'block', width: '100%' }}>{plan.name}</span>
											</MenuItem>
										))}
									</Select>
								</FormControl>
							);
						}
						if (field.type === 'ENUM') {
							return (
								<div key={index}>
									<FormControl fullWidth className='select-type' variant='outlined'>
										<InputLabel>{field?.name}</InputLabel>
										<Select value={fields?.[field?.name] || []} multiple onChange={(event) => setFields({ ...fields, [field.name]: event.target.value })} label={field.name}>
											{field.constraints?.map((cons, index1) => (
												<MenuItem key={index1} value={cons}>
													{cons}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							);
						} else {
							return null;
						}
					})}
				</>
			) : (
				''
			)}
			<Button fullWidth variant='contained' color='primary' onClick={action}>
				{actionMode === 'CREATE' ? 'ایجاد ' : 'ویرایش '}
			</Button>
		</Dialog>
	);
}

export default TagModal;
