import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import TagDefinitionPresentation from './TagDefinitionPresentation';
import Loading from '../../components/loading/loading';
import tagDefinitionActions from '../../../state/tag-definition/action';

function TagDefinition() {
	const { tagDefinitionList, pageCount } = useSelector((state) => state.tagDefinitionReducer);
	const dispatch = useDispatch();

	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		dispatch(tagDefinitionActions.getTagDefinitionList(pageNumber));
	}, [pageNumber, dispatch]);

	return (
		<Layout>
			{tagDefinitionList.length === 0 ? (
				<Loading />
			) : (
				<TagDefinitionPresentation
					tagDefinitionList={tagDefinitionList}
					createTagDefinition={(body) => dispatch(tagDefinitionActions.createTagDefinition(body))}
					setPageNumber={setPageNumber}
					currentPage={pageNumber}
					pageCount={pageCount}
				/>
			)}
		</Layout>
	);
}

export default TagDefinition;
