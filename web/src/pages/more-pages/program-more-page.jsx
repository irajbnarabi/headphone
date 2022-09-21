import './more-page.scss';
import React, { useEffect, useState } from 'react';
import { getProgramMorePages } from '../../shared/services/more-page/more-page-service';
import Loading from '../../components/loading/item-loading/loading';
import ListView from '../../components/list-view/live-view';
import { Button } from '@material-ui/core';
import { setTitle } from '../../shared/services/general/general-service';

function ProgramMorePage(props) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [showLoadMore, setShowLoadMore] = useState(false);

	useEffect(() => {
		setTitle('برنامه‌های بیشتر | تماشای آنلاین فیلم و سریال در Vidosign');
		getProgramMorePages(props.match.params.type, props.match.params.id, page, props.match.params.option).then(
			(res) => {
				setShowLoadMore(res.data.data.length === 20);
				setData(data.concat(res.data.data));
			}
		);
	}, [props.match.params, page]);

	if (data.length === 0) {
		return <Loading />;
	}

	return (
		<div className="list-view-container">
			<ListView
				data={data}
				type={props.match.params.type} />
			{showLoadMore ?
				<Button
					onClick={() => { setPage(page + 1); }}
					variant={'contained'}
					className="load-more">
					<span>موارد بیشتر</span>
				</Button> : null}
		</div>
	);
}

export default ProgramMorePage;
