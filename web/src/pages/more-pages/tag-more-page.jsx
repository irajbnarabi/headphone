import './more-page.scss';
import React, { useEffect, useState } from 'react';
import { getTagMorePages }            from '../../shared/services/more-page/more-page-service';
import Loading                        from '../../components/loading/item-loading/loading';
import ListView                       from '../../components/list-view/live-view';
import BaseEntity                     from '../../components/base-entity/base-entity';
import ImageGenerator                 from '../../components/image-generator/image-generator';
import { Button }                     from '@material-ui/core';
import { setTitle }                   from '../../shared/services/general/general-service';

function TagMorePage (props) {
	const [data, setData]                 = useState([]);
	const [tagIsArray, setTagIsArray]     = useState(null);
	const [page, setPage]                 = useState(1);
	const [showLoadMore, setShowLoadMore] = useState(false);

	useEffect(() => {
		getTagMorePages(props.match.params.id, props.match.params.type, page).then(
			(res) => {
				const responseType = Array.isArray(res.data.data);
				setTagIsArray(responseType);
				if (responseType) {
					setShowLoadMore(res.data.data.length === 20);
					setData(data.concat(res.data.data));
					setTitle('برچسب‌های بیشتر | تماشای آنلاین فیلم و سریال در Vidosign');
				} else {
					setShowLoadMore(false);
					setData(res.data.data);
					setTitle(res.data.data.value + ' | تماشای آنلاین فیلم و سریال در Vidosign');
				}
			}
		);
	}, [props.match.params, page]);

	if (data.length === 0) {
		return <Loading/>;
	}

	const renderTagObject = () => {
		return (
			<div>
				<div className="tag-info">
					<div className="tag-header">
						<div className="tag-background-image"
							 style={{ backgroundImage: `url(${data?.fields?.image})` }}/>
						<div className="tag-info-box">
							<div className="tag-image">
								<ImageGenerator src={data?.fields?.image}
												name={data?.value}/>
							</div>
							<h1>{data?.value}</h1>
						</div>
					</div>
					<div className="tag-body">
						<p>{data?.fields?.bio}</p>
					</div>
				</div>
				<BaseEntity data={data?.carousels}/>
			</div>
		);
	};

	return (
		<div className="list-view-container">
			{tagIsArray ? <ListView data={data}
									type={props.match.params.type}/> : renderTagObject()}
			{showLoadMore ? <Button onClick={() => {setPage(page + 1);}}
									variant={'contained'}
									className="load-more">
				<span>موارد بیشتر</span>
			</Button> : null}
		</div>
	);
}

export default TagMorePage;
