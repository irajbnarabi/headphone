import './sessions.scss';
import React, { useEffect, useState }                                   from 'react';
import { getSessions, terminateOtherSessions, terminateSpecialSession } from '../../../shared/services/user/user-service';
import Loading                                                          from '../../../components/loading/item-loading/loading';
import { handleTimeStamp, setTitle }                                    from '../../../shared/services/general/general-service';
import { Button }                                                       from '@material-ui/core';
import Toast                                                            from '../../../components/toast/toast';
import { ShowToast, toastTypes }                                        from '../../../components/toast/show-tosat';
import ErrorHandler                                                     from '../../../components/error-handler/error-handler';

function SessionsPage () {
	const [sessions, setSessions]         = useState(null);
	const [toastData, setToastData]       = useState([]);
	const [errorHandler, setErrorHandler] = useState(null);

	useEffect(() => {
		setTitle('لیست دستگاه‌های دیگر');
		getSessions().then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					setSessions(res.data.data);
				}
			}
		).catch(
			(error) => {
				setErrorHandler(error);
			}
		);

	}, []);

	if (errorHandler) return <ErrorHandler error={errorHandler}/>;

	if (!sessions) return <Loading/>;

	const terminateSessions = () => {
		terminateOtherSessions().then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					setToastData(ShowToast(toastTypes.error, 'بقیه دستگاه‌ها ارتباطشان قطع شد.'));
					getSessions().then(
						(res) => {
							setSessions(res.data.data);
						}
					);
				}
			}
		);
	};

	const terminateOneDevice = (id) => {
		terminateSpecialSession(id).then(
			(res) => {
				if (res.status === 200 && res.data.code === 200) {
					setToastData(ShowToast(toastTypes.error, 'ارتباط این دستگاه‌ قطع شد.'));
					getSessions().then(
						(res) => {
							setSessions(res.data.data);
						}
					);
				}
			}
		);
	};

	return (
		<div className="sessions-container">
			<h1>سایر دستگاه‌ها</h1>
			<div className="session-list">
				{sessions.map((session, index) => <div key={index}
													   className="session-item">
					<div className="device-detail">
						<div>{session.device}</div>
						<div className="empty-section">{session.ip}</div>
					</div>
					<span className={session.current ? 'online-status' : 'offline-status'}>{session.current ? 'دستگاه فعلی' : <div className="last-usage">
						<span>{handleTimeStamp(session.lastUsage, 'onlyDate')}</span>
						<span className="separator"> ، </span>
						<span>{handleTimeStamp(session.lastUsage, 'onlyTime')}</span>
					</div>}</span>
					{/*<span className="empty-section">{session.ip}</span>*/}
					{!session.current ? <Button variant="contained"
												onClick={() => terminateOneDevice(session.id)}
												className="terminate-this-device">
						<span>قطع ارتباط این دستگاه</span>
					</Button> : <span/>}
				</div>)}
			</div>
			<Button variant={'contained'}
					onClick={() => terminateSessions()}
					className="terminate-other-device">
				<span>قطع ارتباط همه‌ی دستگاه‌های دیگر</span>
			</Button>

			<Toast toastList={toastData}
				   position={'bottom-right'}
				   autoDelete={true}
				   dismissTime={3000}/>
		</div>
	);
}

export default SessionsPage;
