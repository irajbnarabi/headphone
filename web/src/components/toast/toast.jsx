import './toast.scss';
import React, { useEffect, useState } from 'react';
import PropTypes                      from 'prop-types';
import { Icon }                       from '@material-ui/core';
import CloseIcon                      from '@material-ui/icons/Close';

const Toast = props => {
	const { toastList, position, autoDelete, dismissTime } = props;
	const [list, setList]                                  = useState(toastList);

	useEffect(() => {
		setList([...toastList]);
	}, [toastList]);

	useEffect(() => {
		const deleteToast = id => {
			const listItemIndex = list.findIndex(e => e.id === id);
			const toastListItem = toastList.findIndex(e => e.id === id);
			list.splice(listItemIndex, 1);
			toastList.splice(toastListItem, 1);
			setList([...list]);
		};

		const interval = setInterval(() => {
			if (autoDelete && toastList.length && list.length) {
				deleteToast(toastList[ 0 ].id);
			}
		}, dismissTime);

		return () => {
			clearInterval(interval);
		};
	}, [toastList, autoDelete, dismissTime, list]);

	const deleteToast = id => {
		const listItemIndex = list.findIndex(e => e.id === id);
		const toastListItem = toastList.findIndex(e => e.id === id);
		list.splice(listItemIndex, 1);
		toastList.splice(toastListItem, 1);
		setList([...list]);
	};

	return (
		<div className={`notification-container ${position}`}>
			{
				list.map((toast, i) =>
					<div key={i}
						 className={`notification toast`}
						 style={{ backgroundColor: toast.backgroundColor }}>
						<button onClick={() => deleteToast(toast.id)}
								className="hide-toast">
							<Icon component={CloseIcon}/>
						</button>
						<div>
							<p className="notification-message">
								{toast.description}
							</p>
						</div>
					</div>
				)
			}
		</div>
	);
};

Toast.propTypes = {
	toastList  : PropTypes.array.isRequired,
	position   : PropTypes.string,
	autoDelete : PropTypes.bool,
	dismissTime: PropTypes.number
};

export default Toast;
