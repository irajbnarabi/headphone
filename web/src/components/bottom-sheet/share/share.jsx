import './share.scss';
import { useEffect, useState } from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { Icon, IconButton } from '@material-ui/core';

function ShareBottomSheet ({ data, type = 'movies' }) {
	const [shareItems, setShareItems] = useState(null);

	useEffect(() => {
		setShareItems(null);
		const url         = `vidosign.com/${type}/${data.id}`;
		const title       = data.title;
		const description = data.title;
		const picture     = data.image;
		const items       = [
			{
				type        : 'telegram',
				icon        : TelegramIcon,
				active_class: 'telegram-color',
				link        : `https://telegram.me/share/url?url=${url}&text=${title}`,
				tooltip_name: 'تلگرام'
			},
			{
				type        : 'twitter',
				icon        : TwitterIcon,
				active_class: 'twitter-color',
				link        : `https://twitter.com/intent/tweet?text=${title}`,
				tooltip_name: 'توئیتر'
			},
			{
				type        : 'facebook',
				icon        : FacebookIcon,
				active_class: 'facebook-color',
				link        : `https://www.facebook.com/sharer.php?caption=${title}&u=${url}&description=${description}&picture=${picture}`,
				tooltip_name: 'فیسبوک'
			},
			{
				type        : 'whatsapp',
				icon        : WhatsAppIcon,
				active_class: 'whatsapp-color',
				link        : `https://web.whatsapp.com/send?text=${title}`,
				tooltip_name: 'واتس‌آپ'
			}
		];
		setShareItems(items);
	}, [data, type]);

	return (
		<>
			<div className="share-title">
				<span> اشتراک گذاری</span>
				<span>{type === 'movies' ? ' فیلم سینمایی ' : ' سریال '}</span>
				<span>{data?.title}</span>
			</div>
			<div className="socials">
				{shareItems && shareItems.map((item, index) => {
					console.log(item);
					return (
						<a href={item.link}
						   key={index}
						   rel="noreferrer"
						   target="_blank">
							<IconButton className={item.active_class}>
								<Icon component={item.icon}/>
							</IconButton>
						</a>
					);
				})}
			</div>
		</>
	);
}

export default ShareBottomSheet;
