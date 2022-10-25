import { useContext, useEffect, useState } from 'react';
import { SharePhotoContext } from '../contexts/SharePhotoContext';
import { CreateSharePhotoDto, SharePhoto, UpdateSharePhotoDto } from '../types';
import * as service from '../services';
import { UseUserEvent } from '@/context/eventUserContext';

export default function useSharePhoto() {
	const cUser = UseUserEvent();
	const [loading, setLoading] = useState(false);
	const context = useContext(SharePhotoContext);
	console.log('cUser', cUser);

	if (context === undefined) throw new Error('Debe estar dentro del SharePhotoProvider');

	const { sharePhoto, setSharePhoto } = context;

	useEffect(() => {
		const eventId = cUser.value.event_id;
		console.log('eventId', eventId);
		if (eventId) {
			getSharePhoto(eventId);
		}
	}, []);

	const getSharePhoto = async (eventId: string) => {
		try {
			setLoading(true);
			const sharePhoto = await service.get(eventId);
			console.log('sharePhoto', sharePhoto);
			setSharePhoto(sharePhoto);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const createSharePhoto = async (createSharePhotoDto: CreateSharePhotoDto) => {
		try {
			setLoading(true);
			const newSharePhoto = await service.create(createSharePhotoDto);
			if (newSharePhoto) {
				setSharePhoto(newSharePhoto);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const updateSharePhoto = async (id: SharePhoto['_id'], updateSharePhotoDto: UpdateSharePhotoDto) => {
		try {
			setLoading(true);
			const updatedSharePhoto = await service.update(id, updateSharePhotoDto);
			if (updatedSharePhoto) {
				setSharePhoto(updatedSharePhoto);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteSharePhoto = async (id: SharePhoto['_id']) => {
		try {
			const deletedSharePhoto = await service.remove(id);
			if (deletedSharePhoto) {
				setSharePhoto(null);
			}
		} catch (error) {
		} finally {
		}
	};

	const createPost = () => {
		try {
			setLoading(true);
			// const
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const addLike = () => {
		try {
			setLoading(true);
			// const
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		sharePhoto,
		loading,
		createSharePhoto,
		updateSharePhoto,
		deleteSharePhoto,
		createPost,
		addLike,
	};
}
