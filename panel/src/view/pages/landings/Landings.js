import './Landings.scss';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/loading/loading';
import LandingRowPresentation from './LandingRowPresentation';
import { Button } from '@material-ui/core';
import LandingRowModal from './landing-row-modal/LandingRowModal';
import { renderObjectType, renderType } from './landing-row-modal/RowRenderTypes';
import landingsActions from '../../../state/landings/action';

function LandingsPage() {
	const { type } = useParams();
	const dispatch = useDispatch();
	const { carousels, isLoad } = useSelector((state) => state.landingReducer);
	const [openAddRowModal, setOpenAddRowModal] = useState(false);

	useEffect(() => {
		dispatch(landingsActions.getLandingsData(type));
	}, [type, dispatch]);

	const renderRow = (row, index) => {
		const swapRow = (index, upOrDown) => {
			const b = carousels[index];
			carousels[index] = carousels[upOrDown === 'd' ? index + 1 : index - 1];
			carousels[upOrDown === 'd' ? index + 1 : index - 1] = b;
		};

		const shiftDown = () => {
			carousels[index].order = index + 1;
			carousels[index + 1].order = index;
			swapRow(index, 'd');
			dispatch(landingsActions.updateLandingsData(type, carousels));
		};

		const shiftUp = () => {
			carousels[index].order = index - 1;
			carousels[index - 1].order = index;
			swapRow(index, 'u');
			dispatch(landingsActions.updateLandingsData(type, carousels));
		};

		const updateRowAction = (data, objects) => {
			carousels[index].deepLink = `/${data.renderObjectType === renderObjectType.tag ? 't' : 'p'}/${
				data.renderType === renderType.carousel && data.renderObjectType === renderObjectType.tag
					? 'crew'
					: `${data.renderObjectType === renderObjectType.tag ? 'crew' : data.renderObjectType === renderObjectType.album ? 'albums' : 'playlists'}/${
							data.renderFillValue ? data.renderFillValue : 'latest'
					  }`
			}`;
			carousels[index].title = data.title;
			carousels[index].render.fillValue = data.renderFillValue ? data.renderFillValue : 'latest';
			carousels[index].render.objectType = data.renderObjectType;
			carousels[index].render.type = data.renderType;
			if (objects && objects.length) {
				carousels[index].objects = objects;
			}
			dispatch(landingsActions.updateLandingsData(type, carousels));
		};

		const deleteRowAction = () => {
			carousels.splice(index, 1);
			dispatch(landingsActions.updateLandingsData(type, carousels));
		};

		return (
			<div key={index} className='row'>
				<LandingRowPresentation
					type={type}
					shiftDownRow={() => shiftDown()}
					shiftUpRow={() => shiftUp()}
					updateRowAction={(data, objects) => updateRowAction(data, objects)}
					deleteRowAction={() => deleteRowAction()}
					row={row}
					totalRows={carousels.length}
				/>
			</div>
		);
	};

	const addRowModal = () => {
		setOpenAddRowModal(true);
	};

	const createRow = (data, objects) => {
		const carouselData = {
			title: data.title,
			order: carousels.length,
			deepLink: `/${data.renderObjectType === renderObjectType.tag ? 't' : 'p'}/${
				data.renderType === renderType.carousel && data.renderObjectType === renderObjectType.tag
					? 'crew'
					: `${data.renderObjectType === renderObjectType.tag ? 'crew' : data.renderObjectType === renderObjectType.album ? 'albums' : 'playlists'}/${
							data.renderFillValue ? data.renderFillValue : 'latest'
					  }`
			}`,
			render: {
				fillValue: data.renderFillValue,
				objectType: data.renderObjectType,
				type: data.renderType,
			},
		};
		if (objects && objects.length) {
			carouselData.objects = objects;
		}
		carousels.push(carouselData);
		dispatch(landingsActions.updateLandingsData(type, carousels));
	};

	const renderData = () => (
		<div className='landings-table'>
			<div>
				<Button variant={'contained'} onClick={() => addRowModal()}>
					<span>اضافه کردن ردیف جدید</span>
				</Button>
			</div>
			{carousels.map((value, index) => renderRow(value, index))}
		</div>
	);

	return (
		<Layout>
			{isLoad ? renderData() : <Loading />}

			<LandingRowModal type={type} open={openAddRowModal} action={createRow} mode={'CREATE'} onClose={() => setOpenAddRowModal(false)} />
		</Layout>
	);
}

export default LandingsPage;
