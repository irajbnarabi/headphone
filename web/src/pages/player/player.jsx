import './player.scss';
import React, { useEffect, useState } from 'react';
import PlayerComponent from '../../components/player/player';
import Loading from '../../components/loading/item-loading/loading';
import { getLocalStorage, makeFinalRequest } from '../../shared/services/general/general-service';
import { checkUserIsLogin } from '../../shared/services/user/user-service';
import { variable_names } from '../../shared/services/general/configs';

export default function PlayerPage (props) {
	const [data, setData] = useState(null);

	useEffect(() => {
		const getPlayerData = async () => {
			const xhttp              = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4) {
					const data = JSON.parse(xhttp.response);
					setData(data);
				}
			};
			xhttp.open('GET', makeFinalRequest(`headphone/videos/${props.match.params.id}/link`), true);
			if (checkUserIsLogin()) {
				xhttp.setRequestHeader('X-USER-TOKEN', getLocalStorage(variable_names.token, true));
			}
			xhttp.send();
		};
		getPlayerData();
	}, [props]);

	if (!data) {
		return <Loading/>;
	}

	if (data.code !== 200) {
		return <div className="error-message">{data.message}</div>;
	}

	return (
		<PlayerComponent

			playLink={data?.data?.link}
			title={data?.data?.title}
			tags={data?.data?.tags}
			id={props.match.params.id}/>
	);
}
