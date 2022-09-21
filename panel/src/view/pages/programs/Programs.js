import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import './Programs.scss';
import { IconButton } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TextField from '@material-ui/core/TextField';
import Loading from '../../components/loading/loading';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import programActions from '../../../state/program/action';

const types = {
	movies: {
		key: 'album',
		title: 'آلبوم',
	},
	series: {
		key: 'playlist',
		title: 'پلی لیست',
	}
};

function Programs() {
	const dispatch = useDispatch();
	const { programs, pageCount, isLoad } = useSelector((state) => state.programReducer);
	const history = useHistory();

	const [pageNumber, setPageNumber] = useState(1);
	const [type, setType] = useState(types.movies.key);
	const [openDelete, setOpenDelete] = useState(false);
	const [changingId, setChangingId] = useState(null);
	const [searchVal, setSearchVal] = useState('');

	useEffect(() => {
		if (searchVal) {
			dispatch(programActions.searchProgram(type, searchVal));
		} else {
			dispatch(programActions.getProgramsList(type, pageNumber));
		}
	}, [searchVal, pageNumber, type]);

	const handleRemove = (event, id) => {
		event.stopPropagation();
		setChangingId(id);
		setOpenDelete(true);
	};

	const handleShowProgramDetail = (id) => {
		history.push(`/programs/${type}/${id}`);
	};

	const handleAddProgram = () => {
		history.push(`/new-program/${type}`);
	};

	const renderTitles = () => (
		<div className='programs-titles'>
			<div>تصویر</div>
			<div>عنوان</div>
			<div>فعال یا غیر فعال</div>
		</div>
	);

	const renderEnableOrDisable = (program) => {
		const toggleChecked = () => {
			program.enabled = !program.enabled;
			dispatch(programActions.enableOrDisableProgram(program.id, type, program.enabled));
		};

		return (
			<div className='program-is-enable'>
				<FormControlLabel
					style={{ paddingRight: '1rem' }}
					control={<Switch checked={program.enabled} onChange={toggleChecked} name='checkedB' color='primary' />}
					label={program.enabled ? 'فعال' : 'غیرفعال'}
				/>
			</div>
		);
	};

	const renderPrograms = () => (
		<div className='programs-list'>
			{programs?.map((program, index) => (
				<div key={index}>
					<div>
						<img className='image-box' src={program.image} alt={program.title} />
					</div>
					<div>{program.title}</div>
					{renderEnableOrDisable(program)}
					<div className='program-list-item-tools'>
						<IconButton onClick={(event) => handleRemove(event, program.id)}>
							<DeleteIcon fontSize='small' />
						</IconButton>
						<IconButton onClick={() => handleShowProgramDetail(program.id)}>
							<EditIcon fontSize='small' />
						</IconButton>
					</div>
				</div>
			))}
		</div>
	);

	const renderDeleteModal = () => <ConfirmModal open={openDelete} onClose={() => setOpenDelete(false)} action={() => dispatch(programActions.deleteProgram(type, changingId, pageNumber))} />;

	return (
		<Layout>
			<div className='programs'>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<FormControl style={{ width: '300px', marginBottom: '20px' }} variant='outlined'>
						<InputLabel>نوع برنامه</InputLabel>
						<Select value={type} onChange={(e) => setType(e.target.value)} label='نوع برنامه'>
							{Object.entries(types).map(([key, value]) => (
								<MenuItem key={key} value={value.key}>
									{value.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<div className='programs-list-add'>
						<TextField label={'جست‌جو'} variant={'outlined'} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
						<Button variant='contained' color='primary' onClick={() => handleAddProgram()}>
							<span>افزودن</span>
						</Button>
					</div>
				</div>
				{!isLoad ? (
					<Loading />
				) : programs.length === 0 ? (
					<span>برنامه‌ای وجود ندارد</span>
				) : (
					<div>
						{renderTitles()}
						{renderPrograms()}
						<Pagination className='programs-pagination' count={pageCount} variant='outlined' color='primary' onChange={(event, value) => setPageNumber(value)} />
					</div>
				)}
			</div>
			{openDelete && renderDeleteModal()}
		</Layout>
	);
}

export default Programs;
