import './movie-detail.scss';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import movieDetailAction from '../../../store/actions/movie.action';
import { getLocalStorage, makeFinalRequest, setTitle } from '../../../shared/services/general/general-service';
import Loading from '../../../components/loading/item-loading/loading';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ImageGenerator from '../../../components/image-generator/image-generator';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import MediaCarousel from '../../../components/carousel/media/media-carousel';
import BaseEntity from '../../../components/base-entity/base-entity';
import Promotion from '../../../components/promotion/promotion';
import StarIcon from '@material-ui/icons/Star';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import favListAdd from '../../../assets/images/fav-list-add.svg';
import favListAdded from '../../../assets/images/fav-list-added.svg';
import ShareIcon from '@material-ui/icons/Share';
import { Link, useHistory } from 'react-router-dom';
import { variable_names } from '../../../shared/services/general/configs';
import { addToFavorite, checkUserIsLogin, dislikeProgram, likeProgram, removeFromFavorite } from '../../../shared/services/user/user-service';
import Toast from '../../../components/toast/toast';
import { ShowToast, toastTypes } from '../../../components/toast/show-tosat';
import AuthenticationDialogHandler from '../../../components/authentication-dialog-handler/authentication-dialog-handler';
import PlansDialog from '../../../components/dialog/subscription/plans/plans';
import BillDialog from '../../../components/dialog/subscription/bill/bill';
import ShareBottomSheet from '../../../components/bottom-sheet/share/share';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { IconButton } from '@material-ui/core';

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
		height  : '215px',
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
		fontSize      : '30px',
		fontWeight    : 'bold',
		width         : '100%',
		justifyContent: 'center'
	},
	other_info_show              : {
		paddingTop: '140px'
	}
}));

function MovieDetailPage (props) {
	const { movieData, isLoad }                       = useSelector(state => state.movieDetail);
	const { profile }                                 = useSelector(state => state.profileData);
	const [scrollTop, setScrollTop]                   = useState(0);
	const classes                                     = useStyles();
	const [state, setState]                           = useState({
		top   : false,
		left  : false,
		bottom: false,
		right : false
	});
	const [drawerType, setDrawerType]                 = useState('');
	const [promotionData, setPromotionData]           = useState([]);
	const [crews, setCrews]                           = useState([]);
	const [casts, setCasts]                           = useState([]);
	const history                                     = useHistory();
	const dispatch                                    = useDispatch();
	const [toastData, setToastData]                   = useState([]);
	const [openProfileDialog, setOpenProfileDialog]   = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const [openPlansDialog, setOpenPlansDialog]       = useState(false);
	const [openBill, setOpenBill]                     = useState(false);
	const [billTitle, setBillTitle]                   = useState(null);
	const [planId, setPlanId]                         = useState(null);
	const [planType, setPlanType]                     = useState(null);

	const getMovieDetails = async () => {
		const httpRequest              = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const data = JSON.parse(httpRequest.response);
				dispatch(movieDetailAction(data.data, props.match.params.id));
			}
		};
		httpRequest.open('GET', makeFinalRequest(`headphone/movies/${props.match.params.id}/page`), true);
		if (checkUserIsLogin()) {
			httpRequest.setRequestHeader('X-USER-TOKEN', getLocalStorage(variable_names.token, true));
		}
		httpRequest.send();
	};

	useEffect(() => {
		dispatch(movieDetailAction(null, props.match.params.id));
		getMovieDetails();
	}, [props.match.params, dispatch]);

	useEffect(() => {
		if (isLoad) {
			setTitle('فیلم سینمایی ' + movieData.title + ' | تماشای آنلاین فیلم و سریال در Vidosign');
			setPromotionData(movieData?.tags?.media);
			if (movieData?.tags?.online) {
				setBillTitle('بلیط ' + movieData?.title);
				setPlanType('ticket');
				setPlanId(movieData?.tags?.online[ 0 ].bindings.ticket);
			}
		}
	}, [movieData, isLoad]);

	useEffect(() => {
		if (window.innerWidth <= 980) {
			const onScroll = e => {
				setScrollTop(e.target.documentElement.scrollTop);
			};
			window.addEventListener('scroll', onScroll);

			return () => window.removeEventListener('scroll', onScroll);
		}
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

		if (JSON.stringify(movieData) !== '{}') {
			const crews      = movieData?.tags?.crew;
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
	}, [movieData]);

	useEffect(() => {
		getMovieDetails();
	}, [profile]);

	if (!isLoad) {
		return <Loading/>;
	}

	const toggleDrawer = (anchor, open, drawer_type) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [ anchor ]: open });
		setDrawerType(drawer_type);
	};

	const renderTags = (tags) => {
		const renderImdbRate = () => {
			if (tags?.[ 'imdb-rate' ] && tags?.[ 'imdb-rate' ][ 0 ].bindings?.rate) {
				return (<span
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
				<span>{tags?.[ 'time-info' ] ? <span>{tags[ 'time-info' ][ 0 ].bindings.duration}<span className="pipe">|</span></span> : null}</span>
			);
		};

		const renderProducedYear = () => {
			return (
				<span>{tags?.[ 'production-year' ] ? <span>{tags[ 'production-year' ][ 0 ].bindings.year}<span className="pipe">|</span></span> : null}</span>
			);
		};

		return (
			<div className="movie-other-info">
				{renderImdbRate()}
				{renderTimeInfo()}
				{renderProducedYear()}
				{tags?.pg ? <div className="restriction">
					<span>{tags.pg[ 0 ].bindings.age}</span>
				</div> : null}
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

	const handleAddToFavClick = () => {
		if (checkUserIsLogin()) {
			if (movieData.isFavorite) {
				removeFromFavorite(movieData.id).then(
					(res) => {
						if (res.status === 200 && res.data.code === 200) {
							getMovieDetails();
							setToastData(ShowToast(toastTypes.error, 'از فهرست شخصی حذف شد'));
						}
					}
				);
			} else {
				addToFavorite(movieData.id).then(
					(res) => {
						if (res.status === 200 && res.data.code === 200) {
							getMovieDetails();
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
				likeProgram(movieData?.id, 'series', 'do_like').then(() => getMovieDetails()).catch(
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
				dislikeProgram(movieData?.id, 'series', 'do_dislike').then(() => getMovieDetails()).catch(
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
						<span>{movieData?.likedPercent}</span>
					</div>
					<span> | </span>
					<span className="like-count">({movieData?.likeCount})</span>
				</div>
				<IconButton className={movieData?.liked ? 'liked' : ''}
							color={'primary'}
							onClick={() => handleLike()}>
					<Icon component={ThumbUpIcon}/>
				</IconButton>
				<IconButton className={movieData?.disliked ? 'disliked' : ''}
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

			if (movieData.tags.soon) {
				return <Button variant={'text'}
							   className="buy-ticket">
					<span>به زودی</span>
				</Button>;
			} else {
				if (movieData.tags.free) {
					return <Button variant={'text'}
								   className="play">
						<Link to={`/player/${movieData.id}`}>
							<Icon component={PlayArrowIcon}/>
						</Link>
					</Button>;
				} else if (movieData.tags.online) {
					if (JSON.stringify(profile) === '{}' || !profile) {
						return <Button variant={'contained'}
									   onClick={() => handleAuthenticate()}
									   className="buy-ticket"
									   color={'default'}>
							<span>خرید بلیط و تماشا</span>
						</Button>;
					} else {
						if (movieData.userHasTicket) {
							return <Button variant={'text'}
										   className="play">
								<Link to={`/player/${movieData.id}`}>
									<Icon component={PlayArrowIcon}/>
								</Link>
							</Button>;
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
							return <Button variant={'text'}
										   className="play">
								<Link to={`/player/${movieData.id}`}>
									<Icon component={PlayArrowIcon}/>
								</Link>
							</Button>;
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
				<FixedCoverImage image={movieData.image}
								 className="background-image"/>
				<div className={`movie-info ${scrollTop < 155 ? classes.series_info_box : ''}`}>
					<div className={scrollTop < 155 ? classes.fixed_header_before_scroll : classes.fixed_header_after_scroll}>
						<FixedCoverImage image={movieData.image}
										 className="background-image-after-scroll"/>
						<div className={scrollTop < 155 ? '' : classes.header_scrolling}>
							<div className={scrollTop < 155 ? classes.header_scrolling_before_title : classes.header_scrolling_after_title}>
								<span>{movieData.title}</span>
							</div>
							<div className={scrollTop < 155 ? `main-image ${classes.main_image}` : classes.main_image_after_scroll}>
								<ImageGenerator src={movieData.image}
												name={movieData.title}/>
							</div>
							<div className={scrollTop < 155 ? classes.first_view_title : classes.title_after_scroll}>
								<span>{movieData.title}</span>
							</div>
							{renderTags(movieData?.tags)}
							{renderGenres(movieData?.tags)}
							{renderLikeDislike()}
							<div className="operation-box">
								<Button className="share"
										onClick={toggleDrawer('bottom', true, 'share')}
										variant={'text'}>
									<Icon component={ShareIcon}/>
								</Button>
								{handleStatus()}
								<Button className="add-to-list"
										onClick={handleAddToFavClick}
										variant={'text'}>
									<ImageGenerator src={movieData.isFavorite ? favListAdded : favListAdd}
													isLazy={false}
													name={''}/>
								</Button>
							</div>
						</div>
					</div>
					<Box className={scrollTop < 155 ? '' : classes.other_info_show}>
						<p className="description">{movieData.description}</p>
						{crews.length ? <>
							<hr className="light-custom-hr"/>
							{renderCrews()}</> : null}
						{casts.length ? <>
							<hr className="light-custom-hr"/>
							{renderCasts()}</> : null}
						{promotionData && promotionData.length ? <>
							<hr className="light-custom-hr"/>
							<MediaCarousel data={promotionData}
										   teaser={movieData?.tags?.teaser}/></> : null}
						<hr className="light-custom-hr"/>
						<BaseEntity data={movieData?.carousels}/>
					</Box>
				</div>
			</div>
		);
	};

	const desktopView = () => {
		return (
			<div className="desktop-view">
				<Promotion data={promotionData}
						   renderLikeDislike={renderLikeDislike()}
						   movieDetail={movieData}
						   handleAddToFav={handleAddToFavClick}/>
				<div className="info">
					<h1>{movieData.title}</h1>
					{renderTags(movieData?.tags)}
					{renderGenres(movieData.tags)}
					<p>{movieData.description}</p>
				</div>
				{crews.length ? <>
					<hr className="light-custom-hr"/>
					{renderCrews()}</> : null}
				{casts.length ? <>
					<hr className="light-custom-hr"/>
					{renderCasts()}</> : null}
				<hr className="light-custom-hr"/>
				<BaseEntity data={movieData?.carousels}/>
			</div>
		);
	};

	const renderCrews = () => <div className="movie-involved">
		{crews.map((reFormatCrew, index) => <div className="movie-involved-items"
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
							<ImageGenerator src={cast.fields?.image}
											isLazy={false}
											name={cast.value}/>
							<span className="cast-name">{cast.value}</span>
						</div>
					</Link>)}
				</div>
			</div>
		);
	};

	const renderMovieData = () => {
		return (
			<div className="movie-page">
				{window.innerWidth > 980 ? desktopView() : mobileView()}
			</div>
		);
	};

	const handleBillDialog = (selectedPlan) => {
		setPlanId(selectedPlan.id);
		setBillTitle(selectedPlan.name);
		setPlanType('subscription');
		setOpenBill(true);
	};

	const handleBillDialogClose = () => {
		if (movieData.tags.online) {
			setOpenBill(false);
		} else {
			setOpenBill(false);
			setOpenPlansDialog(true);
		}
	};

	return (
		<div className="movie-detail-container">
			{renderMovieData()}
			<SwipeableDrawer className="edit-profile-drawer"
							 anchor={'bottom'}
							 open={state[ 'bottom' ]}
							 onClose={toggleDrawer('bottom', false)}
							 onOpen={toggleDrawer('bottom', true)}>
				{
					drawerType === 'share' ? <ShareBottomSheet data={movieData}/> : null
				}
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
						programId={movieData.id}
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

export default MovieDetailPage;
