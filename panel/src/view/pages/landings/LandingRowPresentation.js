import './Landings.scss';
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { ArrowDownward, ArrowUpward, Delete, Edit } from '@material-ui/icons';
import LandingRowModal from './landing-row-modal/LandingRowModal';
import ConfirmModal from '../confirm-modal/ConfirmModal';

function LandingRowPresentation({ row, totalRows, shiftDownRow, shiftUpRow, updateRowAction, deleteRowAction, type }) {
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	return (
		<>
			<div className='row-operations'>
				<IconButton aria-label='edit' onClick={shiftDownRow} style={{ display: `${row.order === totalRows - 1 ? 'none' : 'block'}` }}>
					<ArrowDownward />
				</IconButton>
				<IconButton aria-label='edit' onClick={shiftUpRow} style={{ display: `${row.order > 0 ? 'block' : 'none'}` }}>
					<ArrowUpward />
				</IconButton>
			</div>
			<div className='row-info'>
				<span>{row.order}</span>
				<span>
					<span>نام : </span>
					<span>{row.title}</span>
				</span>
				<div>
					<div>
						<span>نوع ردیف : </span>
						<span>{row.render.type}</span>
					</div>
					<div>
						<span>نوع آیتم‌های هر ردیف : </span>
						<span>{row.render.objectType}</span>
					</div>
				</div>
			</div>
			<div className='row-operations'>
				<IconButton aria-label='delete' onClick={() => setOpenDeleteModal(true)}>
					<Delete />
				</IconButton>
				<IconButton aria-label='edit' onClick={() => setOpenEditModal(true)}>
					<Edit />
				</IconButton>
			</div>

			<LandingRowModal type={type} open={openEditModal} data={row} action={updateRowAction} mode={'UPDATE'} onClose={() => setOpenEditModal(false)} />

			<ConfirmModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} action={deleteRowAction} />
		</>
	);
}

export default LandingRowPresentation;
