import { useContext, useState } from 'react';
import { SharePhotoContext } from '../contexts/SharePhotoContext';
import { CreateSharePhotoDto, SharePhoto, UpdateSharePhotoDto } from '../types';
import * as service from '../services';

export default function useSharePhoto() {
	const [loading, setLoading] = useState(false);
	const context = useContext(SharePhotoContext);

	if (context === undefined)
		throw new Error('Debe estar dentro del SharePhotoProvider');

	const { sharePhoto, setSharePhoto } = context;

	const createSharePhoto = (createSharePhotoDto: CreateSharePhotoDto) => {
		const newSharePhoto = service.create(createSharePhotoDto);
		setSharePhoto(newSharePhoto);
	};

	const updateSharePhoto = (updateSharePhotoDto: UpdateSharePhotoDto) => {
		const updatedSharePhoto = service.update(updateSharePhotoDto);
		setSharePhoto(updatedSharePhoto);
	};

	const deleteSharePhoto = (id: SharePhoto['_id']) => {
		const deletedSharePhoto = service.remove(id);
		setSharePhoto(deletedSharePhoto);
	};

	const createPost = () => {};

	const addLike = () => {};

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
