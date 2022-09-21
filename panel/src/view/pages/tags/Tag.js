import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import TagPresentation from './TagPresentation';
import tagActions from '../../../state/tag/action';
import tagDefinitionActions from '../../../state/tag-definition/action';

function TagsPage() {
	const { tagList, pageCount, isLoad } = useSelector((state) => state.tagReducer);
	const { tagDefinitionList } = useSelector((state) => state.tagDefinitionReducer);
	const dispatch = useDispatch();
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		dispatch(tagActions.getTagList(pageNumber));
		dispatch(tagDefinitionActions.getTagDefinitionList());
	}, [pageNumber]);

	const handleSearch = (query) => {
		if (query) {
			dispatch(tagActions.searchTag(query));
		} else {
			dispatch(tagActions.getTagList(pageNumber));
		}
	};

	return (
		<Layout>
			<TagPresentation search={handleSearch} isLoadData={isLoad} tagList={tagList} tagDefList={tagDefinitionList} currentPage={pageNumber} setPageNumber={setPageNumber} pageCount={pageCount} />
		</Layout>
	);
}

export default TagsPage;
