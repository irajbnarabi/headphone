import React, { useState } from 'react';
import './TagDefinitionModal.scss';
import { Button, Dialog, TextField } from '@material-ui/core';
import Items from './Item';

function TagDefinitionModal({ open, onClose, actionMode, currentTagDefinition, action }) {
	const [name, setName] = useState(currentTagDefinition?.name || '');
	const [fields, setFields] = useState(currentTagDefinition?.fields || []);
	const [bindings, setBindings] = useState(currentTagDefinition?.bindings || []);

	const handleSubmit = async () => {
		const body = {
			bindings,
			fields,
			name,
		};
		await action(body);
		onClose();
	};

	const renderAction = () => {
		return (
			<Button fullWidth variant='contained' color='primary' onClick={handleSubmit}>
				{actionMode === 'CREATE' ? 'ایجاد' : 'ویرایش'}
			</Button>
		);
	};

	return (
		<Dialog
			classes={{
				root: 'tag-definition-modal',
				paper: 'tag-definition-modal-paper',
			}}
			open={open}
			onClose={onClose}
		>
			<div className=''>
				<b>
					{actionMode === 'CREATE' ? 'ایجاد ' : 'ویرایش '}
					مشخصات تگ‌ها
				</b>
			</div>
			<div className='tdm-content'>
				<TextField fullWidth label='عنوان' required variant='outlined' value={name} onChange={(e) => setName(e.target.value)} />
				<Items title='فیلدها' items={fields} changeItems={setFields} />
				<Items title='داده‌های تکمیلی' items={bindings} changeItems={setBindings} />
			</div>
			<div className=''>{renderAction()}</div>
		</Dialog>
	);
}

export default TagDefinitionModal;
