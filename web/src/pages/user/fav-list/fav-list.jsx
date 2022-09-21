import './fav-list.scss';
import React, { useEffect, useState } from 'react';
import { getFavList }                 from '../../../shared/services/user/user-service';
import ListView                       from '../../../components/list-view/live-view';
import { Button }                     from '@material-ui/core';
import { useHistory }                 from 'react-router-dom';
import Loading                        from '../../../components/loading/item-loading/loading';
import AuthenticationDialogHandler    from '../../../components/authentication-dialog-handler/authentication-dialog-handler';
import { setTitle }                   from '../../../shared/services/general/general-service';

export default function FavListPage () {
	const [isLoad, setIsLoad]                         = useState(null);
	const [movies, setMovies]                         = useState(null);
	const [series, setSeries]                         = useState(null);
	const [errorHandler, setErrorHandler]             = useState(null);
	const [openProfileDialog, setOpenProfileDialog]   = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const history                                     = useHistory();

	useEffect(() => {
		setTitle('لیست علاقه مندی‌ها | لیست شخصی');
		getFavList().then(
			(res) => {
				setIsLoad(true);
				if (res.status === 200 && res.data.code === 200) {
					setMovies(res.data.data.movies);
					setSeries(res.data.data.series);
				}
			}
		).catch(
			(error) => {
				setIsLoad(true);
				setErrorHandler(error);
			}
		);
	}, []);

	if (!isLoad) return <Loading/>;

	const handleRegister = () => {
		if (window.innerWidth > 980) {
			setOpenRegisterDialog(true);
		} else {
			history.push('/register');
		}
	};

	if (errorHandler) return <div className="must-authenticate">
		<b>برای دسترسی به این قسمت باید وارد حساب کاربری خود شوید</b>
		<Button variant={'contained'}
				onClick={handleRegister}
				color={'default'}>
			<span>ورود</span>
		</Button>

		<AuthenticationDialogHandler openProfileDialog={openProfileDialog}
									 setOpenProfileDialog={setOpenProfileDialog}
									 openRegisterDialog={openRegisterDialog}
									 setOpenRegisterDialog={setOpenRegisterDialog}/>
	</div>;

	return (
		<div className="fav-list-container">
			{movies && movies.length ? <>
				<h2>فیلم‌ها</h2>
				<ListView data={movies}
						  type={'movies'}/>
			</> : null}
			{series && series.length ? <>
				<h2>سریال‌ها</h2>
				<ListView data={series}
						  type={'series'}/>
			</> : null}
		</div>
	);
}
