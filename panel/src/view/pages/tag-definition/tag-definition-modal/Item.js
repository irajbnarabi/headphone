import React, { useEffect, useState } from 'react';
import './TagDefinitionModal.scss';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const types = {
	ENUM: {
		key: 'ENUM',
		title: 'انتخابی',
	},
	IMAGE: {
		key: 'IMAGE',
		title: 'تصویر',
	},
	VIDEO: {
		key: 'VIDEO',
		title: 'ویدئو',
	},
	DATE: {
		key: 'DATE',
		title: 'تاریخ',
	},
	NUMBER: {
		key: 'NUMBER',
		title: 'عدد',
	},
	TEXT: {
		key: 'TEXT',
		title: 'متن',
	},
	UNIQUE: {
		key: 'UNIQUE',
		title: 'یکتا',
	},
	MULTILINE: {
		key: 'MULTILINE',
		title: 'چندخطی',
	},
	TICKET: {
		key: 'TICKET',
		title: 'تیکت',
	},
};

function Items(props) {
	const [items, setItems] = useState(props.items || []);

	useEffect(() => {
		props.changeItems(items);
	}, [items, props]);

	const renderItem = (item, index) => {
		const changeItemName = (event) => {
			const newItems = [...items];
			newItems[index].name = event.target.value;
			setItems(newItems);
		};

		const changeItemType = (event) => {
			const newItems = [...items];
			newItems[index].type = event.target.value;
			setItems(newItems);
		};

		const changeItemConstraints = (event) => {
			const newItems = [...items];
			newItems[index].constraints = event.target.value.split('-');
			setItems(newItems);
		};

		const deleteItem = () => {
			const newItems = [...items];
			setItems(newItems.filter((element, id) => index !== id));
		};

		return (
			<div className='tdm-field' key={index}>
				<FormControl className='select-type' variant='outlined'>
					<InputLabel>نوع</InputLabel>
					<Select value={item.type} onChange={changeItemType} label='نوع'>
						{Object.entries(types).map(([key, value]) => (
							<MenuItem key={key} value={value.key}>
								{value.title}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField label={props.title} className='full-box' value={items[index].name} variant='outlined' onChange={(event) => changeItemName(event)} />
				{item.type === types.ENUM.key && (
					<TextField
						label='مقادیر'
						className='full-box'
						value={items[index].constraints?.join('-')}
						variant='outlined'
						helperText='مقادیر را با - وارد کنید'
						onChange={(event) => changeItemConstraints(event)}
					/>
				)}
				<IconButton onClick={() => deleteItem()}>
					<DeleteIcon />
				</IconButton>
			</div>
		);
	};

	const addItem = () => {
		const newItem = {
			name: '',
			type: types.TEXT.key,
		};
		const newItems = [...items, newItem];
		setItems(newItems);
	};

	const renderItemsList = () => {
		return (
			<div className='tdm-content-array'>
				<p>{props.title}</p>
				{items?.map((item, index) => renderItem(item, index))}
				<div>
					<IconButton onClick={() => addItem()}>
						<AddIcon />
					</IconButton>
				</div>
			</div>
		);
	};

	return renderItemsList();
}

export default Items;
