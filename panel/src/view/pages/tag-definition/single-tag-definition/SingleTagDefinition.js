import React from 'react';
import { useDispatch } from 'react-redux';
import SingleTagDefinitionPresentation from './SingleTagDefinitionPresentation';
import tagDefinitionActions from '../../../../state/tag-definition/action';

function TagDefinition({ preview, currentPage }) {
	const dispatch = useDispatch();

	return (
		<SingleTagDefinitionPresentation
			preview={preview}
			updateTagDefinition={(id, body) => dispatch(tagDefinitionActions.updateTagDefinition(id, body, currentPage))}
			currentTagDefinition={preview}
			deleteTagDefinition={(id) => dispatch(tagDefinitionActions.deleteTagDefinition(id, currentPage))}
		/>
	);
}

export default TagDefinition;
