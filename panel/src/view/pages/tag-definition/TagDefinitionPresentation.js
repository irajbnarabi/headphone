import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import './TagDefinition.scss';
import SingleTagDefinition from './single-tag-definition/SingleTagDefinition';
import TagDefinitionModal from './tag-definition-modal/TagDefinitionModal';

function TagDefinitionPresentation({ tagDefinitionList, createTagDefinition, currentPage, setPageNumber, pageCount }) {
	const [modalOpen, setModalOpen] = useState(false);

	const renderCreateModal = () => <TagDefinitionModal open={modalOpen} onClose={() => setModalOpen(false)} actionMode='CREATE' action={(body) => createTagDefinition(body)} />;

	return (
		<div className='tag-definition'>
			{renderCreateModal()}
			<div className='td-add-button'>
				<Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
					افزودن
				</Button>
			</div>
			<div className='td-titles'>
				<div>عنوان</div>
				<div>فیلدها</div>
				<div>داده‌های تکمیلی</div>
			</div>
			{tagDefinitionList?.map((tagDefinition, index) => (
				<SingleTagDefinition key={index} currentPage={currentPage} preview={tagDefinition} />
			))}
			<Pagination className='td-pagination' count={pageCount} variant='outlined' color='primary' onChange={(event, pageNum) => setPageNumber(pageNum)} />
		</div>
	);
}

export default TagDefinitionPresentation;
