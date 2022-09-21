import { useDispatch } from 'react-redux';
import React from 'react';
import SingleTagPresentation from './SingleTagPresentation';
import tagActions from '../../../../state/tag/action';

function SingleTag({ preview, tagDefList, currentPage }) {
	const dispatch = useDispatch();

	return (
		<SingleTagPresentation
			currentTag={preview}
			tagDefList={tagDefList}
			deleteTag={() => {
				dispatch(tagActions.deleteTag(preview.id, currentPage));
			}}
			preview={preview}
			currentPage={currentPage}
		/>
	);
}

export default SingleTag;
