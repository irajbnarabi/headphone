import './mobile-navigator.scss'
import React, { useState } from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import seriesIcon from '../../assets/images/mobile-menu/tv.svg'
import favListIcon from '../../assets/images/mobile-menu/fav-list.svg'
import moviesIcon from '../../assets/images/mobile-menu/movies.svg'
import searchIcon from '../../assets/images/mobile-menu/search.svg'
import moreIcon from '../../assets/images/mobile-menu/more.svg'
import { isPlatformBrowser } from '../../shared/services/general/general-service'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

function NavigatorItems() {
	const [value, setValue] = useState('')
	const history = useHistory()
	const { profile } = useSelector((state) => state.profileData)

	let navigator_items = [
		{
			title: 'فیلم',
			titleEn: 'icon-movies',
			icon: moviesIcon,
			url: '/'
		},
		{
			title: 'سریال',
			titleEn: 'icon-series',
			icon: seriesIcon,
			url: '/series'
		},
		{
			title: 'فهرست شخصی',
			titleEn: 'icon-fav-list',
			icon: favListIcon,
			url: '/fav-list'
		},
		{
			title: 'جستجو',
			icon: searchIcon,
			titleEn: 'icon-search',
			url: '/search'
		},
		{
			title: 'بیشتر',
			icon: moreIcon,
			titleEn: 'icon-more',
			url: JSON.stringify(profile) !== '{}' ? '/profile' : '/register'
		}
	]

	const handleChange = (event, newValue) => {
		history.push(newValue)
		setValue(newValue)
	}

	setTimeout(() => {
		if (isPlatformBrowser()) {
			setValue(window.location.pathname)
		}
	}, 1)

	const listItems = navigator_items.map((item, index) => (
		<BottomNavigation value={value} key={index} onChange={handleChange} showLabels>
			<BottomNavigationAction label={item.title} value={item.url} icon={<span className={`icon ${item.titleEn}`} />} />
		</BottomNavigation>
	))

	return <div id="navigator">{listItems}</div>
}

function Navigator() {
	return <NavigatorItems />
}

export default Navigator
