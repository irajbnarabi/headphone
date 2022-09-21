import './countdown.scss';
import PropTypes                      from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Icon }                       from '@material-ui/core';
import ChevronLeftIcon                from '@material-ui/icons/ChevronLeft';
import { AxiosResponse }              from 'axios';
import type { ResponseModel }         from '../../shared/model/response/response.model';
import { ShowToast, toastTypes }     from '../toast/show-tosat';
import Toast                          from '../toast/toast';

const Countdown = (props) => {
	const [seconds, setSeconds]     = useState(props.initialTime);
	const [isActive, setIsActive]   = useState(true);
	const [toastData, setToastData] = useState([]);
	const [time, setTime]           = useState({ sec: Math.floor(props.initialTime % 60), min: Math.floor(props.initialTime / 60) });

	function reset () {
		setSeconds(props.initialTime);
		props.resetFunc().then(
			(result: AxiosResponse) => {
				let response: ResponseModel = result.data;
				setToastData(ShowToast(toastTypes.error, response.message));
				if (result.status === 200 && response.code === 200) {
					setIsActive(true);
				}
			}
		);
	}

	useEffect(() => {
		let interval = null;
		if (isActive) {
			interval = setInterval(() => {
				setSeconds(seconds => seconds - 1);
				setTime({
					sec: Math.floor(seconds % 60),
					min: Math.floor(seconds / 60)
				});
			}, 1000);
		} else if (!isActive && seconds !== 0) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [isActive, seconds]);

	const renderTimer = () => {
		return (
			<span>{time.min > 0 ? time.min : 0} : {time.sec > 0 ? time.sec : 0}</span>
		);
	};

	return (
		<div className="app">
			<div className="time">
				{seconds >= 0 ? renderTimer() :
					<button className="button"
							onClick={reset}>
						<span>ارسال مجدد کد تایید</span>
						<Icon component={ChevronLeftIcon}/>
					</button>
				}
			</div>
			<Toast toastList={toastData}
				   position={'bottom-right'}
				   autoDelete={false}
				   dismissTime={3000}/>
		</div>
	);
};

Countdown.propTypes = {
	initialTime: PropTypes.number.isRequired,
	resetFunc  : PropTypes.func
};

export default Countdown;
