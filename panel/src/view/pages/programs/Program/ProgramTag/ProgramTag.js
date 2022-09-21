/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import './ProgramTag.scss';
import ProgramTagModal from '../ProgramTagModal/ProgramTagModal';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import programActions from '../../../../../state/program/action';

function ProgramTag({ type, tag, programId }) {
	const [modalOpen, setModalOpen] = useState(false);
	const dispatch = useDispatch();

	const handleDelete = (event) => {
		event.stopPropagation();
		dispatch(programActions.deleteProgramTags(type, programId, tag.id));
	};

	const handleUpdate = (chosenTag) => {
		dispatch(programActions.updateProgramTags(type, programId, chosenTag.id, chosenTag.bindings));
	};

	const renderModal = () => <ProgramTagModal open={modalOpen} onClose={() => setModalOpen(false)} tag={tag} actionType={'edit'} action={handleUpdate} />;

	return (
		<div className='program-tag' onClick={() => setModalOpen(true)}>
			<div>
				<p>{tag.value}</p>
				<IconButton size='small' onClick={handleDelete}>
					<DeleteIcon fontSize='small' />
				</IconButton>
			</div>
			{/* <div>*/}
			{/*    {Object.entries(tag?.bindings || {})?.map(([key, value]) => {*/}
			{/*        return (*/}
			{/*            <small>{key} : {value}</small>*/}
			{/*        );*/}
			{/*    })}*/}
			{/* </div>*/}
			{modalOpen && renderModal()}
		</div>
	);
}

export default ProgramTag;
