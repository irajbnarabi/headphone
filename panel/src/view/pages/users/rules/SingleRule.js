import RuleModal from './rule-modal/RuleModal';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import ruleActions from '../../../../state/rule/action';

function SingleRule({ preview }) {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	return (
		<div>
			{open && <RuleModal open={open} onClose={() => setOpen(false)} rule={preview} mode={'EDIT'} />}
			<div>{preview.name}</div>
			<div>{preview.path}</div>
			<div>{preview.method}</div>
			<div className='rl-item-tools'>
				<IconButton onClick={() => setOpenDeleteModal(true)}>
					<DeleteIcon fontSize='small' />
				</IconButton>
				<IconButton
					onClick={() => {
						setOpen(true);
					}}
				>
					<EditIcon fontSize='small' />
				</IconButton>
			</div>
			<ConfirmModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} action={() => dispatch(ruleActions.deleteRule(preview.id))} />
		</div>
	);
}

export default SingleRule;
