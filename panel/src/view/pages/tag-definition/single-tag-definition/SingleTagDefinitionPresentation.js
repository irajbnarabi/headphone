import './SingleTagDefinition.scss';
import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import TagDefinitionModal from '../tag-definition-modal/TagDefinitionModal';
import { getPersian } from '../../utils';

function SingleTagDefinitionPresentation({ updateTagDefinition, currentTagDefinition, preview, deleteTagDefinition }) {
	const [modalOpen, setModalOpen] = useState(false);
	//    const [openDelete, setOpenDelete] = useState(false);

	const renderModal = () => (
		<TagDefinitionModal
			open={modalOpen}
			onClose={() => setModalOpen(false)}
			actionMode='EDIT'
			currentTagDefinition={currentTagDefinition}
			action={(body) => updateTagDefinition(currentTagDefinition.id, body)}
		/>
	);

	const renderAction = () => (
		<div className='std-actions'>
			{/* <IconButton onClick={() => setOpenDelete(true)}>*/}
			{/*    <DeleteIcon fontSize="small"/>*/}
			{/* </IconButton>*/}
			<IconButton onClick={() => setModalOpen(true)}>
				<EditIcon fontSize='small' />
			</IconButton>
		</div>
	);

	//    const renderDelete = () => (
	//        <ConfirmModal
	//            open={openDelete}
	//            onClose={() => setOpenDelete(false)}
	//            action={() => deleteTagDefinition(preview.id)}
	//        />
	//    );

	return (
		<>
			<div className='single-tag-definition'>
				<div>{getPersian(preview.name)}</div>
				<div>{preview.fields?.map((value) => value.name).join('، ')}</div>
				<div>{preview.bindings?.map((value) => value.name).join('، ')}</div>
				{renderAction()}
			</div>
			{renderModal()}
			{/* {openDelete && renderDelete()}*/}
		</>
	);
}

export default SingleTagDefinitionPresentation;
