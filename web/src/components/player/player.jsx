import './player.scss';
import React, { useEffect, useState } from 'react';
import videojs from 'video.js';
import videojsqualityselector from 'videojs-hls-quality-selector';
import { isPlatformBrowser, setTitle } from '../../shared/services/general/general-service';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { sendAnalyticsEvent } from '../../shared/services/analytics/analytics-service';

require('videojs-contrib-quality-levels');
require('videojs-hls-quality-selector');
require('videojs-seek-buttons');

export default function PlayerComponent ({ playLink, title = '', id, tags }) {
	const [player, setPlayer]                       = useState(null);
	const [showSkipTitration, setShowSkipTitration] = useState(false);
	const history                                   = useHistory();

	useEffect(() => {
		setTitle('پخش برنامه‌ی ' + title);
		const hideOtherElement = () => {
			if (isPlatformBrowser()) {
				let main_section = document.getElementsByClassName('main-section');
				let header       = document.getElementById('header');
				let navigator    = document.getElementById('navigator');
				if (main_section && main_section.length) {
					main_section.item(0).style.margin = 0;
				}
				if (header) {
					header.style.display = 'none';
				}
				if (navigator) {
					navigator.style.display = 'none';
				}
			}
		};
		hideOtherElement();
		initialPlayer();
	});

	useEffect(() => {
		return () => {
			const showOtherElements = () => {
				if (isPlatformBrowser()) {
					let main_section = document.getElementsByClassName('main-section');
					let header       = document.getElementById('header');
					let navigator    = document.getElementById('navigator');
					if (main_section && main_section.length && window.innerWidth > 980) {
						main_section.item(0).style.marginTop = '70px';
					}
					if (header && window.innerWidth > 980) {
						header.style.display = 'flex';
					}
					if (navigator && window.innerWidth <= 980) {
						navigator.style.display = 'flex';
					}
				}
			};
			showOtherElements();
		};
	}, []);

	useEffect(() => {
		if (player) {
			player.src({
				src : playLink,
				type: 'application/x-mpegURL'
			});
			player.seekButtons({
				forward: 30,
				back   : 10
			});
			player.hlsQualitySelector = videojsqualityselector;
			player.hlsQualitySelector();
			customPlayerControlBar();
			sendAnalyticsEvent('watch', {
				id   : id,
				title: title
			});
		}
	}, [playLink, player]);

	useEffect(() => {
		setInterval(() => {
			setShowSkipTitration(player?.currentTime() > 10 && player?.currentTime() < 70);
		}, 1000);
	}, [player]);

	function initialPlayer () {
		const options = {
			aspectRatio          : '16:9',
			controls             : true,
			preload              : 'auto',
			fluid                : false,
			autoplay             : true,
			displayCurrentQuality: true,
			playbackRates        : [.25, .5, 1, 1.5, 2],
			html5                : {
				hls: {
					overrideNative: true
				}
			},
			hls                  : {
				withCredentials: true
			}
		};
		setPlayer(videojs(document.getElementById('video'), options));
	}

	const customPlayerControlBar = () => {
		const renderVideoName = () => {
			const returnBtn = document.createElement('BUTTON');
			returnBtn.setAttribute('class', 'return-btn');
			returnBtn.addEventListener('click', () => {
				history.goBack();
			});
			document?.getElementsByClassName('vjs-custom-control-spacer')?.item(0)?.appendChild(returnBtn);
			document?.getElementsByClassName('vjs-custom-control-spacer')?.item(0)?.append(title);
		};

		const renderSubtitle = (otherOperations) => {
			const changeSubtitleSrc = document?.getElementsByClassName('vjs-subs-caps-button vjs-control').item(0)
											  ?.getElementsByClassName('vjs-menu')?.item(0)?.children[ 0 ];
			const title             = document?.createElement('LI');
			title.appendChild(document?.createTextNode('زیرنویس'));
			changeSubtitleSrc.insertBefore(title, changeSubtitleSrc?.firstChild);
			otherOperations.appendChild(changeSubtitleSrc);
		};

		const renderAudio = (otherOperations) => {
			const changeAudioSrc = document.getElementsByClassName('vjs-audio-button vjs-control').item(0)
										   .getElementsByClassName('vjs-menu').item(0).children[ 0 ];
			const title          = document.createElement('LI');
			title.appendChild(document.createTextNode('صدا'));
			changeAudioSrc.insertBefore(title, changeAudioSrc.firstChild);
			otherOperations.appendChild(changeAudioSrc);
		};

		const renderOperations = () => {
			const otherOperations = document?.createElement('DIV');
			otherOperations.setAttribute('class', 'other-operations');
			renderSubtitle(otherOperations);
			renderAudio(otherOperations);
			const settingBtnMenu = document?.getElementsByClassName('vjs-menu-button vjs-menu-button-popup vjs-control vjs-button vjs-quality-selector')?.item(0)
										   ?.getElementsByClassName('vjs-menu')?.item(0);
			settingBtnMenu?.appendChild(otherOperations);
		};

		if (document && player) {
			renderVideoName();
			setTimeout(() => {
				renderOperations();
			}, 5000);
		}
	};

	const handleSkipTitration = () => {
		player.currentTime(70);
	};

	return (
		<div className="main-container">
			<video id="video"
				   className="video-js vjs-big-play-centered vjs-big-play-button vjs-control vjs-seek-button vjs-default-button"/>
			<Button
				className={showSkipTitration ? 'skip-titration' : 'no-display-skip'}
				onClick={() => handleSkipTitration()}
				variant={'contained'}>
				<span>رد کردن تیتراژ</span>
			</Button>
		</div>
	);
}
