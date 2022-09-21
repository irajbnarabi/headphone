import './Tag.scss';
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TagModal from './tag-modal/TagModal';
import SingleTag from './single-tag/SingleTag';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Loading from '../../components/loading/loading';

function TagPresentation({ tagList, tagDefList, currentPage, setPageNumber, pageCount, search, isLoadData }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [searchVal, setSearchVal] = useState('');

	const renderCreateModal = () => (
		<TagModal
			currentPage={currentPage}
			open={modalOpen}
			tagDefinitionList={tagDefList}
			onClose={() => {
				setModalOpen(false);
			}}
			actionMode='CREATE'
		/>
	);

	useEffect(() => {
		search(searchVal);
	}, [searchVal]);

	return (
		<div className='tag-list'>
			{modalOpen ? renderCreateModal() : null}
			<div className='td-add-button'>
				<TextField label={'جست‌جو'} variant={'outlined'} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
				<Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
					افزودن
				</Button>
			</div>
			{!isLoadData ? (
				<Loading />
			) : tagList.length === 0 ? (
				<span> برای ورودی {searchVal} تگی وجود ندارد. </span>
			) : (
				<>
					<div className='td-titles'>
						<div>عنوان</div>
						<div>نام مشخصات تگ‌ها</div>
						<div>داده</div>
					</div>
					{tagList?.map((tag, index) => (
						<SingleTag key={index} preview={tag} tagDefList={tagDefList} currentPage={currentPage} />
					))}
					<Pagination className='td-pagination' count={pageCount} variant='outlined' color='primary' onChange={(event, pageNum) => setPageNumber(pageNum)} />
				</>
			)}
		</div>
	);
}

export default TagPresentation;
