import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import userActions from '../../../../state/user/action';

function SingleUser({ preview }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	return (
		<div>
			<div>{preview.id}</div>
			<div>{preview.name}</div>
			<div>{preview.mobile}</div>
			<div>{preview?.roles?.join(' ، ')}</div>
			<div className='ul-item-tools'>
				<IconButton onClick={() => setOpenDeleteModal(true)}>
					<DeleteIcon fontSize='small' />
				</IconButton>
				<IconButton onClick={() => history.push(`/users/${preview.id}`)}>
					<EditIcon fontSize='small' />
				</IconButton>
			</div>
			<ConfirmModal action={() => dispatch(userActions.deleteUser(preview.id))} open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />
		</div>
	);
}

export default SingleUser;
