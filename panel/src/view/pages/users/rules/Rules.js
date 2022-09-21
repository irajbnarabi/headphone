import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import './Rules.scss';
import { Button } from '@material-ui/core';
import RuleModal from './rule-modal/RuleModal';
import SingleRule from './SingleRule';
import ruleActions from '../../../../state/rule/action';

function Rules() {
	const { ruleList } = useSelector((state) => state.ruleReducer);
	const [page] = useState(1);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(ruleActions.getRuleList(page));
	}, []);

	return (
		<Layout>
			<div className='rule-list'>
				<Button className='rl-button' variant='contained' color='primary' onClick={() => setCreateModalOpen(true)}>
					افزودن
				</Button>
				<div className='rl-titles'>
					<div>نام</div>
					<div>path</div>
					<div>method</div>
				</div>
				<div className='rl-items'>
					{ruleList.map((item, index) => (
						<SingleRule key={index} preview={item} />
					))}
				</div>
			</div>
			<RuleModal mode='CREATE' open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
		</Layout>
	);
}

export default Rules;
