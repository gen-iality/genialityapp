import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { SharePhotoApi } from '@/helpers/request';
import { AddLikeDto, CreatePostDto, CreateSharePhotoDto, Post, SharePhoto, UpdateSharePhotoDto } from '../types';

export const get = async (eventId: string): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.getOne(eventId);
		if (response._id) {
			if (!response.posts) {
				return { ...response, posts: [] };
			}
			return response;
		} else {
			return null;
		}
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};

export const create = async (createSharePhotoDto: CreateSharePhotoDto): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.createOne({
			event_id: createSharePhotoDto.event_id,
			title: createSharePhotoDto.title,
			tematic: '',
			active: false,
			published: false,
			points_per_like: 1,
		});
		const result = { ...response, posts: [] };
		await firestore
			.collection('sharePhotoByEvent')
			.doc(createSharePhotoDto.event_id)
			.set(result);
		return result;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear la dinamica', action: 'show' });
		return null;
	}
};

export const update = async (
	sharePhotoId: SharePhoto['_id'],
	updateSharePhotoDto: UpdateSharePhotoDto
): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.updateOne(sharePhotoId, updateSharePhotoDto);
		let result = response;
		if (!response.posts) {
			result = { ...response, posts: [] };
		}
		await firestore
			.collection('sharePhotoByEvent')
			.doc(result.event_id)
			.update(result);
		return result;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al actualizar la dinamica', action: 'show' });
		return null;
	}
};

export const remove = async (sharePhotoId: SharePhoto['_id'], eventId: string) => {
	try {
		await SharePhotoApi.deleteOne(sharePhotoId);
		await firestore
			.collection('sharePhotoByEvent')
			.doc(eventId)
			.delete();
		return true;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al eliminar la dinamica', action: 'show' });
		return null;
	}
};

export const addPost = async (sharePhotoId: SharePhoto['_id'], createPostDto: CreatePostDto) => {
	try {
		const response = await SharePhotoApi.addOnePost(sharePhotoId, createPostDto);
		await firestore
			.collection('sharePhotoByEvent')
			.doc(response.event_id)
			.update(response);
		return response;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return null;
	}
};

export const addLike = async (sharePhotoId: SharePhoto['_id'], postId: Post['id'], addLikeDto: AddLikeDto) => {
	try {
		const response = await SharePhotoApi.addOneLike(sharePhotoId, postId, addLikeDto);
		await firestore
			.collection('sharePhotoByEvent')
			.doc(response.event_id)
			.update(response);
		return response;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al dar me gusta', action: 'show' });
		return null;
	}
};

export const listenSharePhoto = (
	eventId: string,
	setSharePhoto: React.Dispatch<React.SetStateAction<SharePhoto | null>>
) => {
	const unSubscribe = firestore
		.collection('sharePhotoByEvent')
		.doc(eventId)
		.onSnapshot(data => {
			// console.log(data.metadata.hasPendingWrites)
			const dataUpdated = data.data();
			if (dataUpdated) {
				setSharePhoto(prev => {
					if (prev === null) return null;
					return {
						_id: dataUpdated._id ?? prev?._id,
						created_at: dataUpdated.created_at ?? prev?.created_at,
						updated_at: dataUpdated.updated_at ?? prev?.updated_at,
						event_id: dataUpdated.event_id ?? prev?.event_id,
						title: dataUpdated.title ?? prev?.title,
						tematic: dataUpdated.tematic ?? prev?.tematic,
						published: dataUpdated.published ?? prev?.published,
						active: dataUpdated.active ?? prev?.active,
						points_per_like: dataUpdated.points_per_like ?? prev?.points_per_like,
						posts: dataUpdated.posts ?? prev?.posts,
					};
				});
			}
		});
	return unSubscribe;
};
