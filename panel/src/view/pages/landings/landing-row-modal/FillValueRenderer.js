import { renderObjectType } from './RowRenderTypes';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import React from 'react';
import { createFilterOptions } from '@material-ui/lab';

const filter = createFilterOptions();

function FillValueRenderer({ objectType, currentFillValue, searchAction, setTagValue, setProgramValue, tagList, programs }) {
	if (objectType === renderObjectType.tag) {
		return (
			<>
				<div>
					<span>id تگ فعلی : </span>
					<span>{currentFillValue}</span>
				</div>
				<Autocomplete
					id='combo-box-demo'
					options={tagList && tagList.length ? tagList : []}
					fullWidth
					onInputChange={searchAction}
					onChange={setTagValue}
					getOptionLabel={(option) => option.value}
					freeSolo
					filterOptions={(options, params) => {
						const filtered = filter(options, params);
						if (params.inputValue !== '') {
							filtered.push({
								value: `"${params.inputValue}"`,
							});
						}
						return filtered;
					}}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					renderInput={(params) => <TextField {...params} label='انتخاب تگ مورد نظر' variant='outlined' />}
				/>
			</>
		);
	} else if (objectType === renderObjectType.album || objectType === renderObjectType.playlist) {
		return (
			<>
				<div>
					<span>id برنامه فعلی : </span>
					<span>{currentFillValue}</span>
				</div>
				<Autocomplete
					id='combo-box-demo2'
					options={programs && programs.length ? programs : []}
					fullWidth
					onInputChange={searchAction}
					onChange={setProgramValue}
					getOptionLabel={(option) => option.title}
					renderInput={(params) => <TextField {...params} label='انتخاب برنامه مورد نظر' variant='outlined' />}
				/>
			</>
		);
	}
	return null;
}

export default FillValueRenderer;
