import RoleModal from './role-modal/RoleModal';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import roleActions from '../../../../state/role/action';
import ruleActions from '../../../../state/rule/action';

function SingleRole({ preview }) {
	const dispatch = useDispatch();
	const { ruleList } = useSelector((state) => state.ruleReducer);
	const [open, setOpen] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	useEffect(() => {
		if (!ruleList?.length) {
			dispatch(ruleActions.getRuleList());
		}
	}, []);

	return (
		<div>
			<div>{preview.name}</div>
			<div>{preview.rules?.map((value) => ruleList?.find((item) => item.id === value)?.name).join('، ')}</div>
			<div className='rl-item-tools'>
				<IconButton onClick={() => setOpenDeleteModal(true)}>
					<DeleteIcon fontSize='small' />
				</IconButton>
				<IconButton onClick={() => setOpen(true)}>
					<EditIcon fontSize='small' />
				</IconButton>
			</div>
			<RoleModal open={open} onClose={() => setOpen(false)} role={preview} mode={'EDIT'} />
			<ConfirmModal action={() => dispatch(roleActions.deleteRole(preview.id))} open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />
		</div>
	);
}

export default SingleRole;
