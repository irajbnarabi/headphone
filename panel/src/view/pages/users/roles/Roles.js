import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import './Roles.scss';
import { Button } from '@material-ui/core';
import RoleModal from './role-modal/RoleModal';
import SingleRole from './SingleRole';
import roleActions from '../../../../state/role/action';

function Roles() {
	const { roleList } = useSelector((state) => state.roleReducer);
	const [page] = useState(1);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(roleActions.getRoleList(page));
	}, []);

	return (
		<Layout>
			<div className='role-list'>
				<Button className='rl-button' variant='contained' color='primary' onClick={() => setCreateModalOpen(true)}>
					افزودن
				</Button>
				<div className='rl-titles'>
					<div>نام</div>
					<div>rules</div>
				</div>
				<div className='rl-items'>
					{roleList.map((item, index) => (
						<SingleRole key={index} preview={item} />
					))}
				</div>
			</div>
			<RoleModal mode='CREATE' open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
		</Layout>
	);
}

export default Roles;
