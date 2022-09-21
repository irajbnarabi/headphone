import './SingleTag.scss';
import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TagModal from '../tag-modal/TagModal';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import { getPersian } from '../../utils';

function SingleTagPresentation({ currentTag, preview, deleteTag, tagDefList, currentPage }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const renderAction = () => (
		<div className='std-actions'>
			<IconButton onClick={() => setOpenDelete(true)}>
				<DeleteIcon fontSize='small' />
			</IconButton>
			<IconButton onClick={() => setModalOpen(true)}>
				<EditIcon fontSize='small' />
			</IconButton>
		</div>
	);

	const renderModal = () => <TagModal open={modalOpen} currentTag={currentTag} tagDefinitionList={tagDefList} onClose={() => setModalOpen(false)} actionMode='EDIT' currentPage={currentPage} />;

	const renderDelete = () => <ConfirmModal open={openDelete} onClose={() => setOpenDelete(false)} action={deleteTag} />;

	return (
		<>
			<div className='single-tag'>
				<div>{preview.value}</div>
				<div>{getPersian(preview.tagDefinitionName)}</div>
				<div>
					{Object.entries(preview.fields || {})?.map(([key, value], index) => (
						<div key={index} className='text-truncate'>
							<span>{key}</span>
							<span>{' : '}</span>
							<span>{value}</span>
						</div>
					))}
				</div>
				{renderAction()}
			</div>
			{renderModal()}
			{openDelete && renderDelete()}
		</>
	);
}

export default SingleTagPresentation;
