import './series-detail.scss';
import React, { useEffect, useState } from 'react';
import { Box, Button, Icon, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { Link, useHistory } from 'react-router-dom';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/styles';
import styled from 'styled-components';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Loading from '../../../components/loading/item-loading/loading';
import ImageGenerator from '../../../components/image-generator/image-generator';
import ShareIcon from '@material-ui/icons/Share';
import BaseEntity from '../../../components/base-entity/base-entity';
import Promotion from '../../../components/promotion/promotion';
import MediaCarousel from '../../../components/carousel/media/media-carousel';
import { getLocalStorage, makeFinalRequest, setTitle } from '../../../shared/services/general/general-service';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { addToFavorite, checkUserIsLogin, dislikeProgram, likeProgram, removeFromFavorite } from '../../../shared/services/user/user-service';
import { variable_names } from '../../../shared/services/general/configs';
import { ShowToast, toastTypes } from '../../../components/toast/show-tosat';
import Toast from '../../../components/toast/toast';
import AuthenticationDialogHandler from '../../../components/authentication-dialog-handler/authentication-dialog-handler';
import { useSelector } from 'react-redux';
import PlansDialog from '../../../components/dialog/subscription/plans/plans';
import BillDialog from '../../../components/dialog/subscription/bill/bill';
import ShareBottomSheet from '../../../components/bottom-sheet/share/share';
import favListAdded from '../../../assets/images/fav-list-added.svg';
import favListAdd from '../../../assets/images/fav-list-add.svg';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const FixedCoverImage = styled.div`
  background-image: url(${props => props.image});
`;

const useStyles = makeStyles(() => ({
	series_info_box              : {
		paddingTop: '32px'
	},
	main_image                   : {
		position    : 'absolute',
		width       : '154px',
		height      : '208px',
		border      : '.5px solid rgba(#707070, .5)',
		borderRadius: '5px',
		overflow    : 'hidden',
		top         : '-184px',
		left        : 'calc(50% - 77px)'
	},
	main_image_after_scroll      : {
		display: 'none'
	},
	first_view_title             : {
		textAlign : 'center',
		fontSize  : '30px',
		fontWeight: 'bold'
	},
	title_after_scroll           : {
		display: 'none'
	},
	fixed_header_before_scroll   : {
		backgroundImage: 'none !important'
	},
	fixed_header_after_scroll    : {
		position: 'fixed',
		top     : '0',
		width   : '100%',
		height  : '235px',
		zIndex  : '1'
	},
	header_scrolling             : {
		position            : 'absolute',
		bottom              : '0',
		width               : '100%',
		backgroundColor     : 'white',
		borderTopRightRadius: '16px',
		borderTopLeftRadius : '16px',
		border              : '1px solid #c3c3c3',
		paddingTop          : '12px'
	},
	header_scrolling_before_title: {
		display: 'none'
	},
	header_scrolling_after_title : {
		display       : 'flex',
		position      : 'absolute',
		top           : '-50px',
		fontSize      : '22px',
		fontWeight    : 'bold',
		width         : '100%',
		justifyContent: 'center'
	},
	other_info_show              : {
		paddingTop: '160px'
	}
}));

function SeriesDetailPage (props) {
	const [seriesData, setSeriesData]                 = useState({});
	const [scrollTop, setScrollTop]                   = useState(0);
	const [seasons, setSeasons]                       = useState(null);
	const [selectSeason, setSelectSeason]             = useState(null);
	const classes                                     = useStyles();
	const [state, setState]                           = useState({
		top   : false,
		left  : false,
		bottom: false,
		right : false
	});
	const [drawerType, setDrawerType]                 = useState('');
	const [promotionData, setPromotionData]           = useState([]);
	const [episodeInfo, setEpisodeInfo]               = useState(null);
	const [crews, setCrews]                           = useState([]);
	const [casts, setCasts]                           = useState([]);
	const history                                     = useHistory();
	const [toastData, setToastData]                   = useState([]);
	const [openProfileDialog, setOpenProfileDialog]   = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const { profile }                                 = useSelector(state => state.profileData);
	const [openPlansDialog, setOpenPlansDialog]       = useState(false);
	const [openBill, setOpenBill]                     = useState(false);
	const [billTitle, setBillTitle]                   = useState(null);
	const [planId, setPlanId]                         = useState(null);
	const [planType, setPlanType]                     = useState(null);
	const [anchorEl, setAnchorEl]                     = useState(null);

	const getSeriesDetails = async () => {
		const xhttp              = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const data = JSON.parse(xhttp.response);
				if (data.code === 200) {
					setSeriesData(data.data);
					if (props.match.params.season) {
						setEpisodeInfo(data.data.seasons[ props.match.params.season ][ props.match.params.episode ]);
					}
					setSeasons(data?.data?.seasons);
					const season = {
						key     : Object.keys(data.data.seasons)[ 0 ],
						episodes: data.data.seasons[ Object.keys(data.data.seasons)[ 0 ] ]
					};
					setSelectSeason(season);
				} else {
					alert(data.data[ 'error' ]);
				}
			}
		};
		xhttp.open('GET', makeFinalRequest(`headphone/series/${props.match.params.id}/page${props.match.params.season ? `/${props.match.params.season}/${props.match.params.episode}` : ''}`), true);
		if (checkUserIsLogin()) {
			xhttp.setRequestHeader('X-USER-TOKEN', getLocalStorage(variable_names.token, true));
		}
		xhttp.send();
	};

	useEffect(() => {
		setSeriesData({});
		getSeriesDetails();
	}, [props.match.params]);

	useEffect(() => {
		if (JSON.stringify(seriesData) !== '{}') {
			setPromotionData(seriesData?.tags?.media);
			setTitle('سریال ' + seriesData.title + ' | تماشای آنلاین فیلم و سریال در Vidosign');
			if (seriesData?.tags?.online) {
				setBillTitle('بلیط ' + seriesData?.title);
				setPlanType('ticket');
				setPlanId(seriesData?.tags?.online[ 0 ].bindings.ticket);
			}
		}
	}, [seriesData]);

	useEffect(() => {
		const onScroll = e => {
			setScrollTop(e.target.documentElement.scrollTop);
		};
		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, [scrollTop]);

	useEffect(() => {
		const arraysEqual = (a, b) => {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length !== b.length) return false;
			for (let i = 0; i < a.length; ++i) {
				if (a[ i ] !== b[ i ]) return false;
			}
			return true;
		};

		const reformatOtherCrews = (crews) => {
			const oCrew = [];
			crews.forEach((crew) => {
				if (oCrew.length === 0) {
					oCrew.push({
						role : crew.bindings.role,
						crews: [{
							id   : crew.id,
							title: crew.value
						}]
					});
				} else {
					let findCrew = false;
					oCrew.forEach((o_crew) => {
						findCrew = arraysEqual(o_crew.role, crew.bindings.role);
						if (findCrew) {
							o_crew.crews.push({
								id   : crew.id,
								title: crew.value
							});
						}
					});
					if (!findCrew) {
						oCrew.push({
							role : crew.bindings.role,
							crews: [{
								id   : crew.id,
								title: crew.value
							}]
						});
					}
				}
			});
			return oCrew;
		};

		if (episodeInfo) {
			const crews      = episodeInfo?.tags?.crew ? episodeInfo?.tags?.crew : [];
			const casts      = [];
			const otherCrews = [];
			crews.forEach((item) => {
				const isCast = item.bindings.role.filter((value) => {
					return value === 'بازیگر';
				});
				if (isCast.length) {
					casts.push(item);
				} else {
					otherCrews.push(item);
				}
			});
			setCasts(casts);
			setCrews(reformatOtherCrews(otherCrews));
		} else {
			if (JSON.stringify(seriesData) !== '{}') {
				const crews      = seriesData?.tags?.crew;
				const casts      = [];
				const otherCrews = [];
				crews.forEach((item) => {
					const isCast = item.bindings.role.filter((value) => {
						return value === 'بازیگر';
					});
					if (isCast.length) {
						casts.push(item);
					} else {
						otherCrews.push(item);
					}
				});
				setCasts(casts);
				setCrews(reformatOtherCrews(otherCrews));
			}
		}
	}, [seriesData, episodeInfo]);

	useEffect(() => {
		getSeriesDetails();
	}, [profile]);

	if (JSON.stringify(seriesData) === '{}') {
		return <Loading/>;
	}

	const renderSeasonCarousel = () => {
		return (
			<div className="seasons-carousel">
				{selectSeason && selectSeason.episodes ? selectSeason?.episodes.map((item, index) => {
					return (
						<Link key={index}
							  to={`/player/${item.id}`}
							  className="episode-item">
							<div>
								<ImageGenerator src={item.image}/>
								<span className="episode-info">
								<span className="episode-title">{item.title.split('-')[ 1 ]}</span>
								<span className="episode-duration">۵۴ دقیقه</span>
							</span>
								<p className="episode-description">{item.description}</p>
							</div>
						</Link>
					);
				}) : null}
			</div>
		);
	};

	const renderSeasons = () => {
		const renderChangeSeasonMobileBtn = () => <Button variant={'text'}
														  onClick={toggleDrawer('bottom', true, 'change_season')}>
					<span style={{ display: 'flex' }}>
						<span> فصل </span>
						<span> {selectSeason?.key} </span>
						<Icon component={ArrowDropDownIcon}/>
					</span>
		</Button>;

		const renderChangeSeasonDesktopBtn = () => {
			const handleClick = (event) => {
				setAnchorEl(event.currentTarget);
			};

			const handleClose = () => {
				setAnchorEl(null);
			};

			const change = (value) => {
				const selectedSeason = {
					key     : value,
					episodes: seasons[ Object.keys(seasons)[ (+value) - 1 ] ]
				};
				setSelectSeason(selectedSeason);
				handleClose();
			};

			return (
				<>
					<Button aria-controls="simple-menu"
							aria-haspopup="true"
							onClick={handleClick}>
						<span> فصل </span>
						<span style={{ margin: '0 4px' }}>{selectSeason?.key}</span>
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}>
						{Object.keys(seasons).map((value, index) => {
							return (
								<MenuItem variant={'text'}
										  onClick={() => change(value)}
										  key={index}
										  fullWidth={true}>
									<span>فصل</span>
									<span>{value}</span>
								</MenuItem>
							);
						})}
					</Menu>
				</>
			);
		};

		return (
			<div className="season-box">
				<div className="change-season-box">
					{window.innerWidth < 980 ? renderChangeSeasonMobileBtn() : renderChangeSeasonDesktopBtn()}
				</div>
				{renderSeasonCarousel()}
			</div>
		);
	};

	const renderSeriesData = () => {
		return (
			<div className="series-page">
				{window.innerWidth > 980 ? desktopView() : mobileView()}
			</div>
		);
	};

	const renderTags = (tags) => {
		const renderImdbRate = () => {
			if (tags?.[ 'imdb-rate' ] && tags?.[ 'imdb-rate' ][ 0 ].bindings?.rate) {
				return (
					<span
						className="rate">
						<span style={{ display: 'flex', alignItems: 'center' }}>
							<Icon className="star-icon"
								  component={StarIcon}/>
							{tags?.[ 'imdb-rate' ][ 0 ].bindings?.rate}
							<span className="pipe">|</span>
						</span>
					</span>
				);
			}
			return null;
		};

		const renderTimeInfo = () => {
			return (
				<span>{tags?.[ 'time-info' ] ? <span>{tags?.[ 'time-info' ][ 0 ]?.bindings?.duration}<span className="pipe">|</span></span> : null}</span>
			);
		};

		const renderProducedYear = () => {
			return (
				<span>{tags?.[ 'production-year' ] ? <span>{tags?.[ 'production-year' ][ 0 ]?.bindings?.year}<span className="pipe">|</span></span> : null}</span>
			);
		};

		const renderRestriction = () => {
			return (
				<>
					{tags?.pg ?
						<div className="restriction">
							<span>{tags?.pg[ 0 ]?.bindings?.age}</span>
						</div> : null}
				</>
			);
		};

		return (
			<div className="series-other-info">
				{renderImdbRate()}
				{renderTimeInfo()}
				{renderProducedYear()}
				{renderRestriction()}
			</div>
		);
	};

	const renderGenres = (tags) => {
		return (
			<div>{tags?.genre ?
				<ul className="genre-list">
					<li>{tags.genre.map((item, index) => <Link to={`/t/genre/${item.id}`}
															   key={index}>{item.value}</Link>)}</li>
				</ul>
				: null}</div>
		);
	};

	const desktopView = () => {
		return (
			<div className="desktop-view">
				{promotionData && promotionData.length ? <Promotion data={promotionData}
																	renderLikeDislike={renderLikeDislike()}
																	handleAddToFav={handleAddToFavClick}
																	movieDetail={seriesData}/> : null}
				<div className="info">
					<h1>{episodeInfo ? episodeInfo?.title : seriesData?.title}</h1>
					{renderTags(episodeInfo ? episodeInfo?.tags : seriesData?.tags)}
					<p>{episodeInfo ? episodeInfo?.description : seriesData?.description}</p>
				</div>
				{crews.length ? <>
					<hr className="light-custom-hr"/>
					{renderCrews()}</> : null}
				{casts.length ? <>
					<hr className="light-custom-hr"/>
					{renderCasts()}</> : null}
				{seasons ? <>
					<hr className="light-custom-hr"/>
					{renderSeasons()}</> : null}
				<BaseEntity data={seriesData?.carousels}/>
			</div>
		);
	};

	const renderSeriesSeasons = () => {
		return (
			<>
				<div className="play-badge">
					<div className="play-last">
						<Link
							to={`/player/${(seasons?.[ Object.keys(seasons)[ Object.keys(seasons).length - 1 ] ])?.
								[ (seasons?.[ Object.keys(seasons)[ Object.keys(seasons).length - 1 ] ])?.length - 1 ]?.id}`}>
							<Icon component={PlayArrowIcon}/>
						</Link>
					</div>
					<span>پخش آخرین قسمت</span>
				</div>
				<div className="play-badge">
					<div className="play-first">
						<Link to={`/player/${seasons?.[ Object.keys(seasons)[ 0 ] ][ 0 ].id}`}>
							<Icon component={PlayArrowIcon}/>
						</Link>
					</div>
					<span>پخش از قسمت اول</span>
				</div>
			</>
		);
	};

	const handleAddToFavClick = () => {
		if (checkUserIsLogin()) {
			if (seriesData.isFavorite) {
				removeFromFavorite(seriesData.id).then(
					(res) => {
						if (res.status === 200 && res.data.code === 200) {
							getSeriesDetails();
							setToastData(ShowToast(toastTypes.error, 'از فهرست شخصی حذف شد'));
						}
					}
				);
			} else {
				addToFavorite(seriesData.id).then(
					(res) => {
						if (res.status === 200 && res.data.code === 200) {
							getSeriesDetails();
							setToastData(ShowToast(toastTypes.error, 'به فهرست شخصی اضافه شد'));
						}
					}
				);
			}
		} else {
			if (window.innerWidth > 980) {
				setOpenRegisterDialog(true);
			} else {
				history.push('/register');
			}
		}
	};

	const renderLikeDislike = () => {
		const handleLike = () => {
			if (checkUserIsLogin()) {
				likeProgram(seriesData?.id, 'series', 'do_like').then(() => getSeriesDetails()).catch(
					(error) => {
						setToastData(ShowToast(toastTypes.error, error.response.data.message));
					}
				);
			} else {
				if (window.innerWidth > 980) {
					setOpenRegisterDialog(true);
				} else {
					history.push('/register');
				}
			}
		};

		const handleDisLike = () => {
			if (checkUserIsLogin()) {
				dislikeProgram(seriesData?.id, 'series', 'do_dislike').then(() => getSeriesDetails()).catch(
					(error) => {
						setToastData(ShowToast(toastTypes.error, error.response.data.message));
					}
				);
			} else {
				if (window.innerWidth > 980) {
					setOpenRegisterDialog(true);
				} else {
					history.push('/register');
				}
			}
		};

		return (
			<div className="like-dislike">
				<div className="like-info">
					<div className="like-percentage">
						<Icon component={ThumbUpIcon}
							  fontSize={'small'}/>
						<span>{seriesData?.likedPercent}</span>
					</div>
					<span> | </span>
					<span className="like-count">({seriesData?.likeCount})</span>
				</div>
				<IconButton className={seriesData?.liked ? 'liked' : ''}
							color={'primary'}
							onClick={() => handleLike()}>
					<Icon component={ThumbUpIcon}/>
				</IconButton>
				<IconButton className={seriesData?.disliked ? 'disliked' : ''}
							color={'primary'}
							onClick={() => handleDisLike()}>
					<Icon component={ThumbDownIcon}/>
				</IconButton>
			</div>
		);
	};

	const mobileView = () => {
		const handleStatus = () => {
			const handleAuthenticate = () => {
				if (window.innerWidth > 980) {
					setOpenRegisterDialog(true);
				} else {
					history.push('/register');
				}
			};

			if (seriesData.tags.soon) {
				return <Button variant={'text'}
							   className="buy-ticket">
					<span>به زودی</span>
				</Button>;
			} else {
				if (seriesData.tags.free) {
					return <>
						{episodeInfo ? <>
							<div className="play-badge">
								<div className="play-last">
									<Link to={`/player/${episodeInfo?.id}`}>
										<Icon component={PlayArrowIcon}/>
									</Link>
								</div>
								<span>پخش این قسمت</span>
							</div>
						</> : seasons && Object.keys(seasons).length ? renderSeriesSeasons() : null}
					</>;
				} else if (seriesData.tags.online) {
					if (JSON.stringify(profile) === '{}' || !profile) {
						return <Button variant={'contained'}
									   onClick={() => handleAuthenticate()}
									   className="buy-ticket"
									   color={'default'}>
							<span>خرید بلیط و تماشا</span>
						</Button>;
					} else {
						if (seriesData.userHasTicket) {
							return <>
								{episodeInfo ? <>
									<div className="play-badge">
										<div className="play-last">
											<Link to={`/player/${episodeInfo?.id}`}>
												<Icon component={PlayArrowIcon}/>
											</Link>
										</div>
										<span>پخش این قسمت</span>
									</div>
								</> : seasons && Object.keys(seasons).length ? renderSeriesSeasons() : null}
							</>;
						}
						return <Button variant={'contained'}
									   onClick={() => setOpenBill(true)}
									   className="buy-ticket"
									   color={'default'}>
							<span>خرید بلیط و تماشا</span>
						</Button>;
					}
				} else {
					if (JSON.stringify(profile) === '{}' || !profile) {
						return <Button variant={'contained'}
									   className="buy-ticket"
									   onClick={() => handleAuthenticate()}
									   color={'default'}>
							<span>خرید اشتراک</span>
						</Button>;
					} else {
						if (profile?.remainedDays > 0) {
							return <>
								{episodeInfo ? <>
									<div className="play-badge">
										<div className="play-last">
											<Link to={`/player/${episodeInfo?.id}`}>
												<Icon component={PlayArrowIcon}/>
											</Link>
										</div>
										<span>پخش این قسمت</span>
									</div>
								</> : seasons && Object.keys(seasons).length ? renderSeriesSeasons() : null}
							</>;
						}
						return <Button variant={'contained'}
									   className="buy-ticket"
									   onClick={() => setOpenPlansDialog(true)}
									   color={'default'}>
							<span>خرید اشتراک</span>
						</Button>;
					}
				}
			}
		};

		return (
			<div className="mobile-view">
				<FixedCoverImage image={episodeInfo ? episodeInfo?.image : seriesData?.image}
								 className="background-image"/>
				<div className={`series-info ${scrollTop < 155 ? classes.series_info_box : ''}`}>
					<div className={scrollTop < 155 ? classes.fixed_header_before_scroll : classes.fixed_header_after_scroll}>
						<FixedCoverImage image={episodeInfo ? episodeInfo?.image : seriesData?.image}
										 className="background-image-after-scroll"/>
						<div className={scrollTop < 155 ? '' : classes.header_scrolling}>
							<div className={scrollTop < 155 ? classes.header_scrolling_before_title : classes.header_scrolling_after_title}>
								<span>{episodeInfo ? episodeInfo.title : seriesData?.title}</span>
							</div>
							<div className={scrollTop < 155 ? classes.main_image : classes.main_image_after_scroll}>
								<ImageGenerator src={episodeInfo ? episodeInfo?.image : seriesData?.image}
												name={episodeInfo ? episodeInfo?.title : seriesData?.title}/>
							</div>
							<div className={scrollTop < 155 ? classes.first_view_title : classes.title_after_scroll}>
								<span>{episodeInfo ? episodeInfo?.title : seriesData?.title}</span>
							</div>
							{renderTags(episodeInfo ? episodeInfo?.tags : seriesData?.tags)}
							{renderGenres(episodeInfo ? episodeInfo?.tags : seriesData?.tags)}
							{renderLikeDislike()}
							<div className="operation-box">
								<Button className="share"
										variant={'text'}
										onClick={toggleDrawer('bottom', true, 'share')}>
									<Icon component={ShareIcon}/>
								</Button>
								{handleStatus()}
								<Button className="add-to-list"
										onClick={handleAddToFavClick}
										variant={'text'}>
									<ImageGenerator src={seriesData.isFavorite ? favListAdded : favListAdd}
													isLazy={false}
													name={''}/>
								</Button>
							</div>
						</div>
					</div>
					<Box className={scrollTop < 155 ? '' : classes.other_info_show}>
						<p className="description">{episodeInfo ? episodeInfo?.description : seriesData?.description}</p>
						{crews.length ? <>
							<hr className="light-custom-hr"/>
							{renderCrews()}</> : null}
						{casts.length ? <>
							<hr className="light-custom-hr"/>
							{renderCasts()}</> : null}
						{seasons ? <>
							<hr className="light-custom-hr"/>
							{renderSeasons()}</> : null}
						{promotionData && promotionData.length ? <>
							<hr className="light-custom-hr"/>
							<MediaCarousel data={promotionData}
										   teaser={seriesData?.tags?.teaser}/></> : null}
						<hr className="light-custom-hr"/>
						<BaseEntity data={seriesData?.carousels}/>
					</Box>
				</div>
			</div>
		);
	};

	const renderCrews = () => <div className="series-involved">
		{crews.map((reFormatCrew, index) => <div className="series-involved-items"
												 key={index}>
			<div className="item-title">{reFormatCrew?.role?.map((item, index1) => <span key={index1}>{item}</span>)}</div>
			{reFormatCrew?.crews.map((crew, index2) => <div className="item-data"
															key={index2}>
				<Link to={`/t/crew/${crew.id}`}>
					<span>{crew?.title}</span>
					<Icon component={ArrowBackIosIcon}/>
				</Link>
			</div>)}
		</div>)}
	</div>;

	const renderCasts = () => {
		return (
			<div className="casts">
				<h4>بازیگران</h4>
				<div className="casts-box">
					{casts.map((cast, index) => <Link to={`/t/crew/${cast.id}`}
													  className="cast-item"
													  key={index}>
						<div>
							<ImageGenerator name={cast.value}
											isLazy={false}
											src={cast.fields?.image}/>
							<span>{cast.value}</span>
						</div>
					</Link>)}
				</div>
			</div>
		);
	};

	const changeSeasonModal = () => {
		const change = (value) => {
			const selectedSeason = {
				key     : value,
				episodes: seasons[ Object.keys(seasons)[ (+value) - 1 ] ]
			};
			setSelectSeason(selectedSeason);
			toggleDrawer('bottom', false).call();
		};

		return (
			<div>
				{Object.keys(seasons).map((value, index) => {
					return (
						<Button variant={'text'}
								onClick={() => change(value)}
								key={index}
								fullWidth={true}>
							<span>فصل</span>
							<span>{value}</span>
						</Button>
					);
				})}
			</div>
		);
	};

	const toggleDrawer = (anchor, open, drawer_type) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [ anchor ]: open });
		setDrawerType(drawer_type);
	};

	const handleBillDialog = (selectedPlan) => {
		setPlanId(selectedPlan.id);
		setBillTitle(selectedPlan.name);
		setPlanType('subscription');
		setOpenBill(true);
	};

	const handleBillDialogClose = () => {
		if (seriesData.tags.online) {
			setOpenBill(false);
		} else {
			setOpenBill(false);
			setOpenPlansDialog(true);
		}
	};

	return (
		<div className="series-detail-container">
			{renderSeriesData()}
			<SwipeableDrawer className="edit-profile-drawer"
							 anchor={'bottom'}
							 open={state[ 'bottom' ]}
							 onClose={toggleDrawer('bottom', false)}
							 onOpen={toggleDrawer('bottom', true)}>
				{drawerType === 'share' ? <ShareBottomSheet type={'series'}
															data={seriesData}/> :
					drawerType === 'change_season' ? changeSeasonModal() : null}
			</SwipeableDrawer>

			<Toast toastList={toastData}
				   position={'bottom-right'}
				   autoDelete={false}
				   dismissTime={3000}/>

			<PlansDialog open={openPlansDialog}
						 openBillDialog={handleBillDialog}
						 onClose={() => setOpenPlansDialog(false)}/>
			<BillDialog open={openBill}
						planType={planType}
						programId={seriesData.id}
						title={billTitle}
						onClose={() => handleBillDialogClose()}
						planId={planId}/>
			<AuthenticationDialogHandler openProfileDialog={openProfileDialog}
										 setOpenProfileDialog={setOpenProfileDialog}
										 openRegisterDialog={openRegisterDialog}
										 setOpenRegisterDialog={setOpenRegisterDialog}/>
		</div>
	);
}

export default SeriesDetailPage;
