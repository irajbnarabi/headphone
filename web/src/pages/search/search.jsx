import './search.scss';
import React, { useEffect, useState } from 'react';
import { getSearchDetails } from '../../shared/services/search/search-service';
import Loading from '../../components/loading/item-loading/loading';
import { render_object_type } from '../../shared/services/general/configs';
import { Link, useHistory } from 'react-router-dom';
import ImageGenerator from '../../components/image-generator/image-generator';
import { Button } from '@material-ui/core';
import { useInput } from '../../components/custom-hooks/input-hook';
import TextField from '@material-ui/core/TextField';
import SearchDefault from './search-default';
import { setTitle } from '../../shared/services/general/general-service';

function SearchPage (props) {
	const [searchDetails, setSearchDetails]        = useState([]);
	const { bind: bindSearch, reset: resetSearch } = useInput(props.match.params.text);
	const [contentLoad, setContentLoad]            = useState(false);
	const [isDefaultSearch, setIsDefaultSearch]    = useState(true);
	const history                                  = useHistory();

	const getSearchData = (context) => {
		setSearchDetails([]);
		setContentLoad(false);
		if (context.length > 0) {
			getSearchDetails(context).then(
				(res) => {
					if (res.status === 200 && res.data.code === 200) {
						setSearchDetails(res.data.data);
						setContentLoad(true);
						setIsDefaultSearch(false);
					}
				}
			).catch(reason => {
				console.log(reason);
			});
		} else {
			setIsDefaultSearch(true);
		}
	};

	useEffect(() => {
		if (props.match.params.text) {
			setIsDefaultSearch(false);
			getSearchData(props.match.params.text);
		}
	}, [props]);

	useEffect(() => {
		if (isDefaultSearch) {
			setTitle('دسته‌بندی');
		} else {
			setTitle('جستجو برای واژه ' + bindSearch.value);
		}
	}, [isDefaultSearch, props, bindSearch]);

	const [searchElement, setSearchElement] = useState();

	const searchBox = () => {
		const changeInput = (e) => {
			e.preventDefault();
			clearTimeout(searchElement);
			setSearchElement(
				setTimeout(() => {
					getSearchData(e.target.value);
				}, 1000)
			);
		};

		const handleSubmit = (e) => {
			e.preventDefault();
			history.push(`/search/${bindSearch.value}`);
		};

		return (
			<div className="search-input-box">
				{!isDefaultSearch ? <Button variant={'text'}
											onClick={() => resetSearch()}>
					<span>انصراف</span>
				</Button> : null}
				<form autoComplete="off"
					  onSubmit={(e) => handleSubmit(e)}
					  onChange={(e) => changeInput(e)}>
					<TextField {...bindSearch}
							   fullWidth={true}
							   placeholder={'جستجو کنید'}
							   color={'primary'}
							   variant={'outlined'}/>
				</form>
			</div>
		);
	};

	const renderPartHeader = (data) => {
		return (
			<div className="header-bar">
				<span>{data.title}</span>
				{data.objects.length > 6 ?
					<Link to={`/search/${bindSearch.value}/${data.render.objectType}`}>
						<span>همه را ببینید</span>
					</Link> : null}
			</div>
		);
	};

	const renderItemsCard = (item, index, type) => {
		if (index < 6) {
			return (
				<Link key={index}
					  to={`${type === render_object_type.tag ? `/t/${item.tagDefinitionName}` :
						  `/${type === render_object_type.movie ? `movies` : type === render_object_type.series ? `series` : `shows`}`}/${item.id}`}
					  className={`card ${type}`}>
					<ImageGenerator src={type === render_object_type.tag ? item?.fields?.image : item?.image}
									name={type === render_object_type.tag ? item?.value : item?.title}/>
					<div className="card-info">
						<span>{type === render_object_type.tag ? item.value : item.title}</span>
						<span>{item.director}</span>
					</div>
				</Link>
			);
		} else {
			return null;
		}
	};

	const renderBodyPart = (objects, type) => {
		return (
			<div className="box-of-body">
				{objects.map((object, index) => {
					return renderItemsCard(object, index, type);
				})}
			</div>
		);
	};

	const renderItems = (data, index, type) => {
		return (
			<div key={index}>
				{renderPartHeader(data)}
				{renderBodyPart(data.objects, type)}
				<hr className="dark-custom-hr"/>
			</div>
		);
	};

	const showResult = () => {
		if (isDefaultSearch) {
			return <SearchDefault/>;
		} else {
			if (!contentLoad) {
				return null;
			} else {
				if (searchDetails.length === 0) {
					return <Loading/>;
				} else {
					const empty_list = searchDetails.filter(value => value.objects.length);
					if (empty_list.length === 0) {
						return (
							<span>آیتمی برای نمایش وجود ندارد</span>
						);
					}
				}
			}
			return (
				<div>
					{searchDetails.map((value, index) => {
						if (value.objects && value.objects.length) {
							return renderItems(value, index, value.render.objectType);
						}
						return null;
					})}
				</div>
			);
		}
	};

	return (
		<section className="search-container container">
			{searchBox()}
			{showResult()}
		</section>
	);
}

export default SearchPage;
