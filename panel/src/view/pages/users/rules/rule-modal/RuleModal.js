import React, { useEffect, useState } from 'react';
import './RuleModal.scss';
import { Button, Dialog, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ruleActions from '../../../../../state/rule/action';

function RuleModal({ mode, open, onClose, rule }) {
	const [form, setForm] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (open) {
			setForm({ ...rule });
		}
	}, [open]);

	const handleSubmit = () => {
		if (mode === 'CREATE') {
			dispatch(ruleActions.createRule(form));
		} else {
			dispatch(ruleActions.updateRule(form, rule.id));
		}
		onClose();
	};

	return (
		<Dialog classes={{ paper: 'rule-modal' }} open={open} onClose={onClose}>
			<b>Rule</b>
			<div className='rmm-content'>
				<TextField label='name' required fullWidth variant='outlined' value={form?.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
				<TextField label='path' required fullWidth variant='outlined' value={form?.path || ''} onChange={(e) => setForm({ ...form, path: e.target.value })} />
				<TextField label='method' required fullWidth variant='outlined' value={form?.method || ''} onChange={(e) => setForm({ ...form, method: e.target.value })} />
			</div>
			<div className='rmm-action'>
				<Button fullWidth variant='contained' color='primary' onClick={handleSubmit}>
					<span>ثبت</span>
				</Button>
			</div>
		</Dialog>
	);
}

export default RuleModal;
