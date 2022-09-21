import './promotion.scss';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import BillDialog from '../dialog/subscription/bill/bill';
import PlansDialog from '../dialog/subscription/plans/plans';
import { useSelector } from 'react-redux';
import AuthenticationDialogHandler from '../authentication-dialog-handler/authentication-dialog-handler';
import favListAdd from '../../assets/images/fav-list-add-white.svg';
import favListAdded from '../../assets/images/fav-list-added.svg';
import ImageGenerator from '../image-generator/image-generator';
import Icon from '@material-ui/core/Icon';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const PromotionBg = styled.div`
  background-image: url(${props => props.image});
`;

export default function Promotion ({ data, handleAddToFav, movieDetail, renderLikeDislike }) {
	const [openBill, setOpenBill]                     = useState(false);
	const [planId, setPlanId]                         = useState(null);
	const [openPlansDialog, setOpenPlansDialog]       = useState(false);
	const [billTitle, setBillTitle]                   = useState('بلیط ' + movieDetail.title);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const { profile }                                 = useSelector(state => state.profileData);
	const [planType, setPlanType]                     = useState(null);
	const history                                     = useHistory();

	useEffect(() => {
		if (movieDetail.tags.online) {
			setPlanId(movieDetail.tags.online[ 0 ].bindings.ticket);
			setPlanType('ticket');
		}
	}, [movieDetail]);

	const settings = {
		dots          : true,
		infinite      : true,
		speed         : 500,
		slidesToShow  : 1,
		slidesToScroll: 1,
		arrows        : true,
		rtl           : true
	};

	const handleStatus = () => {
		const handleAuthenticate = () => {
			if (window.innerWidth > 980) {
				setOpenRegisterDialog(true);
			} else {
				history.push('/register');
			}
		};

		if (movieDetail.tags.soon) {
			return <Button variant={'text'}
						   className="watch-movie">
				<span>به زودی</span>
			</Button>;
		} else {
			if (movieDetail.tags.free) {
				return <Button variant={'text'}
							   className="watch-movie">
					<Link to={`/player/${movieDetail.id}`}>
						<Icon component={PlayArrowIcon}/>
						<span>تماشای فیلم</span>
					</Link>
				</Button>;
			} else if (movieDetail.tags.online) {
				if (JSON.stringify(profile) === '{}' || !profile) {
					return <Button variant={'contained'}
								   onClick={() => handleAuthenticate()}
								   className="buy-ticket"
								   color={'default'}>
						<span>خرید بلیط و تماشا</span>
					</Button>;
				} else {
					if (movieDetail.userHasTicket) {
						return <Button variant={'text'}
									   className="watch-movie">
							<Link to={`/player/${movieDetail.id}`}>
								<Icon component={PlayArrowIcon}/>
								<span>تماشای فیلم</span>
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
									   className="watch-movie">
							<Link to={`/player/${movieDetail.id}`}>
								<Icon component={PlayArrowIcon}/>
								<span>تماشای فیلم</span>
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

	const handleBillDialog = (selectedPlan) => {
		setPlanId(selectedPlan.id);
		setBillTitle(selectedPlan.name);
		setPlanType('subscription');
		setOpenBill(true);
	};

	const handleBillDialogClose = () => {
		if (movieDetail.tags.online) {
			setOpenBill(false);
		} else {
			setOpenBill(false);
			setOpenPlansDialog(true);
		}
	};

	return (
		<>
			<div className="promotion-banner">
				<Slider {...settings}>
					{data?.map((value, index) => {
						if (value.value === 'image') {
							return (
								<div className="promotion-box"
									 key={index}>
									<div className="linear-gradient-box left"/>
									<div className="linear-gradient-box right"/>
									<PromotionBg image={value.bindings.image}
												 className="promotion-bg">
										<div className="promotion-info">
											<div>
												<div>
													<Button variant={'outlined'}
															onClick={handleAddToFav}
															className="add-to-fav"
															color={'primary'}>
														<ImageGenerator src={movieDetail.isFavorite ? favListAdded : favListAdd}
																		isLazy={false}
																		name={''}/>
													</Button>
													{handleStatus()}
												</div>
												{renderLikeDislike}
											</div>
										</div>
									</PromotionBg>
								</div>
							);
						}
						return null;
					})}
				</Slider>
			</div>
			<PlansDialog open={openPlansDialog}
						 openBillDialog={handleBillDialog}
						 onClose={() => setOpenPlansDialog(false)}/>
			<BillDialog open={openBill}
						programId={movieDetail.id}
						planType={planType}
						title={billTitle}
						onClose={() => handleBillDialogClose()}
						planId={planId}/>
			<AuthenticationDialogHandler openRegisterDialog={openRegisterDialog}
										 setOpenRegisterDialog={setOpenRegisterDialog}/>
		</>
	);
}
