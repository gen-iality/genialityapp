import { useContext, useEffect, useState } from 'react';
import { SharePhotoContext } from '../contexts/SharePhotoContext';
import { CreatePostDto, CreateSharePhotoDto, Post, SharePhoto, UpdateSharePhotoDto } from '../types';
import * as service from '../services';
import { UseUserEvent } from '@/context/eventUserContext';

export default function useSharePhoto() {
	const cUser = UseUserEvent();
	const [loading, setLoading] = useState(false);
	const context = useContext(SharePhotoContext);

	if (context === undefined) throw new Error('Debe estar dentro del SharePhotoProvider');

	const { sharePhoto, setSharePhoto } = context;

	useEffect(() => {
		const eventId = cUser.value.event_id;
		if (eventId && sharePhoto === null) {
			getSharePhoto(eventId);
		}
	}, []);

	const getSharePhoto = async (eventId: string) => {
		try {
			setLoading(true);
			const sharePhoto = await service.get(eventId);
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
			setLoading(true);
			const deletedSharePhoto = await service.remove(id, cUser.value.event_id);
			if (deletedSharePhoto) {
				setSharePhoto(null);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const createPost = async (createPostDto: Omit<CreatePostDto, 'event_user_id'>) => {
		try {
			setLoading(true);
			if (sharePhoto === null || !sharePhoto._id) return;
			const createdPost = await service.addPost(sharePhoto._id, {
				...createPostDto,
				event_user_id: cUser.value._id,
			});
			return createdPost;
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const addLike = async (postId: Post['id']) => {
		try {
			setLoading(true);
			if (sharePhoto === null || !sharePhoto._id) return;
			const response = await service.addLike(sharePhoto._id, postId, {
				event_user_id: cUser.value._id,
			});
			return response;
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const listenSharePhoto = () => {
		const unSubscribe = service.listenSharePhoto(cUser.value.event_id, setSharePhoto);
		return unSubscribe
	};

	return {
		sharePhoto,
		loading,
		createSharePhoto,
		updateSharePhoto,
		deleteSharePhoto,
		createPost,
		addLike,
		listenSharePhoto,
	};
}
