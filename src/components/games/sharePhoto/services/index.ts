import { DispatchMessageService } from '@/context/MessageService';
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
		return { ...response, posts: [] };
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
		if (!response.post) {
			return { ...response, posts: [] };
		}
		return response;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al actualizar la dinamica', action: 'show' });
		return null;
	}
};

export const remove = async (idSharePhoto: SharePhoto['_id']) => {
	try {
		const response = await SharePhotoApi.deleteOne(idSharePhoto);
		return true;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al eliminar la dinamica', action: 'show' });
		return null;
	}
};

export const addPost = async (idSharePhoto: SharePhoto['_id'], createPostDto: CreatePostDto) => {
	try {
		const response = await SharePhotoApi.addOnePost(idSharePhoto, createPostDto);
		return response;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return null;
	}
};

export const addLike = (idSharePhoto: SharePhoto['_id'], idPost: Post['id'], addLikeDto: AddLikeDto) => {
	// return {};
};
