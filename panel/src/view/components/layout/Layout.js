import './Layout.scss';
import { AppBar, Collapse, Drawer, IconButton, List, ListItem, ListItemIcon } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pages } from './constant';
import history from '../../../history';
import authenticationActions from '../../../state/authenticate/action';
import layoutActions from '../../../state/layout/actions';

function Layout(props) {
	const { loginInfo } = useSelector((state) => state.authenticationReducer);
	const { activeRoute, itemsOpen } = useSelector((state) => state.layoutReducer);
	const dispatch = useDispatch();

	useEffect(() => {
		if (loginInfo === null) {
			dispatch(authenticationActions.loadLoginStatus());
		}
	}, [loginInfo]);

	const handleRoute = async (route) => {
		await dispatch(layoutActions.setActiveRoute(route));
		history.push(route);
	};

	const handleClick = (page) => {
		if (page.children) {
			dispatch(layoutActions.setItemOpen({ [page.key]: !itemsOpen[page.key] }));
		}
		if (page.link) {
			handleRoute(page.link);
		}
	};

	const renderLogo = () => (
		<div className='layout-logo'>
			<b>پنل مدیریت IMOVI</b>
		</div>
	);

	const renderItems = () => (
		<List className='layout-sidebar-list'>
			{Object.values(pages).map((page, index) => (
				<div key={index}>
					<ListItem className={`layout-sidebar-list-item ${activeRoute === page?.link ? 'active' : ''}`} button onClick={() => handleClick(page)}>
						{Boolean(page?.icon) && <ListItemIcon>{page?.icon}</ListItemIcon>}
						{page?.title}
						{page?.children ? itemsOpen[page?.key] ? <ExpandLess /> : <ExpandMore /> : <></>}
					</ListItem>
					{Boolean(page?.children) && (
						<Collapse in={itemsOpen[page?.key]} unmountOnExit>
							<List className='layout-sidebar-children-list' button disablePadding>
								{Object.values(page?.children).map((child, index) => (
									<ListItem key={index} button onClick={() => handleRoute(child.link)} className={`layout-sidebar-children-list-item ${activeRoute === child.link ? 'active' : ''}`}>
										{!!child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
										{child.title}
									</ListItem>
								))}
							</List>
						</Collapse>
					)}
				</div>
			))}
		</List>
	);

	const renderDrawer = () => (
		<Drawer
			classes={{
				root: 'layout-sidebar',
				paper: 'layout-sidebar-paper',
			}}
			variant='permanent'
			anchor='left'
			open
		>
			{renderLogo()}
			{renderItems()}
		</Drawer>
	);

	const renderAppBar = () => (
		<AppBar className='layout-appbar' position='fixed'>
			<div className='layout-appbar-items'>
				<IconButton className='appbar-profile' size='small' onClick={() => dispatch(authenticationActions.logOut())}>
					{loginInfo?.principal}
				</IconButton>
			</div>
		</AppBar>
	);

	const renderMain = () => <main>{props.children}</main>;

	return (
		<div className='movito-layout'>
			{renderAppBar()}
			{renderDrawer()}
			{renderMain()}
		</div>
	);
}

export default Layout;
