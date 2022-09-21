import { ShowToast, toastTypes }      from '../toast/show-tosat';
import { useHistory }                 from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Toast                          from '../toast/toast';
import AuthenticationDialogHandler    from '../authentication-dialog-handler/authentication-dialog-handler';

export default function ErrorHandler ({ error }) {
	const [toastData, setToastData]                   = useState([]);
	const [openProfileDialog, setOpenProfileDialog]   = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const history                                     = useHistory();

	useEffect(() => {
		if (error) {
			setToastData(ShowToast(toastTypes.error, error.response.data.message));
			if (error.response.status === 401) {
				if (window.innerWidth > 980) {
					setOpenRegisterDialog(true);
				} else {
					history.push('/register');
				}
			}
		}
	}, [error]);

	return (
		<>
			<Toast toastList={toastData}
				   position={'bottom-right'}
				   autoDelete={true}
				   dismissTime={3000}/>

			<AuthenticationDialogHandler openProfileDialog={openProfileDialog}
										 setOpenProfileDialog={setOpenProfileDialog}
										 openRegisterDialog={openRegisterDialog}
										 setOpenRegisterDialog={setOpenRegisterDialog}/>
		</>
	);
}
