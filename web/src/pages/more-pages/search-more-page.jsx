import './more-page.scss';
import React, { useEffect, useState } from 'react';
import { getMoreSearchData }          from '../../shared/services/search/search-service';
import Loading                        from '../../components/loading/item-loading/loading';
import ListView                       from '../../components/list-view/live-view';
import { Button }                     from '@material-ui/core';
import { setTitle }                   from '../../shared/services/general/general-service';

function SearchMorePage (props) {
	const [data, setData]                 = useState([]);
	const [page, setPage]                 = useState(1);
	const [showLoadMore, setShowLoadMore] = useState(false);

	useEffect(() => {
		setTitle('جستجو‌های بیشتر | تماشای آنلاین فیلم و سریال در Vidosign');
		getMoreSearchData(props.match.params.text, props.match.params.type, page).then(
			(res) => {
				setShowLoadMore(res.data.data[ 0 ].objects.length === 20);
				setData(data.concat(res.data.data[ 0 ].objects));
			}
		);
	}, [props.match.params, page]);

	if (data.length === 0) {
		return <Loading/>;
	}

	return (
		<div className="list-view-container">
			<ListView data={data}
					  type={props.match.params.type}/>
			{showLoadMore ? <Button onClick={() => {setPage(page + 1);}}
									variant={'contained'}
									className="load-more">
				<span>موارد بیشتر</span>
			</Button> : null}
		</div>
	);
}

export default SearchMorePage;
