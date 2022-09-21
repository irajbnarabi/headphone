import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import JalaliUtils from '@date-io/jalaali';
import jMoment from 'moment-jalaali';

export default function RangeDatePicker({ fromDate, setFromDate, toDate, setToDate }) {
	jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

	function RenderDateSelector({ onChange, label, firstValue }) {
		return (
			<MuiPickersUtilsProvider utils={JalaliUtils} locale='fa'>
				<DatePicker
					inputVariant='outlined'
					fullWidth
					label={label}
					clearable
					okLabel='تأیید'
					cancelLabel='لغو'
					clearLabel='پاک کردن'
					labelFunc={(value) => (value ? value.format('jYYYY/jMM/jDD') : '')}
					value={firstValue}
					onChange={(value) => onChange(value)}
				/>
			</MuiPickersUtilsProvider>
		);
	}

	return (
		<div className='analytics-range'>
			<div>
				<RenderDateSelector firstValue={fromDate || ''} label={'از'} onChange={(date) => setFromDate(date)} />
			</div>
			<div>
				<RenderDateSelector firstValue={toDate || ''} label={'تا'} onChange={(date) => setToDate(date)} />
			</div>
		</div>
	);
}
