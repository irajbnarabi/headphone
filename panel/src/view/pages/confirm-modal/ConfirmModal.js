import React from 'react';
import './ConfirmModal.scss';
import { Button, Dialog } from '@material-ui/core';

function ConfirmModal({ open, onClose, action }) {
	return (
		<Dialog classes={{ paper: 'confirm-modal' }} open={open} onClose={onClose}>
			<b>آیا اطمینان دارید؟</b>
			<div className='cm-action'>
				<Button
					fullWidth
					variant='contained'
					color='primary'
					onClick={async () => {
						await action();
						onClose();
					}}
				>
					بله
				</Button>
				<Button fullWidth variant='contained' color='primary' onClick={onClose}>
					خیر
				</Button>
			</div>
		</Dialog>
	);
}

export default ConfirmModal;
