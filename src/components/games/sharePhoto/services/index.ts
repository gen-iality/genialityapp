import { DispatchMessageService } from '@/context/MessageService';
import { SharePhotoApi } from '@/helpers/request';
import { AddLikeDto, CreatePostDto, CreateSharePhotoDto, Post, SharePhoto, UpdateSharePhotoDto } from '../types';

let sharePhotoData: SharePhoto | null = null;

export const get = async (eventId: string): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.getOne(eventId);
		if (response._id && !response.posts) {
			return { ...response, posts: []}
		} else {
			return null
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
		return { ...response, posts: []};
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear la dinamica', action: 'show' });
		return null;
	}
};

export const update = async (sharePhotoId: SharePhoto['_id'], updateSharePhotoDto: UpdateSharePhotoDto): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.updateOne(sharePhotoId, updateSharePhotoDto)
		if (!response.post) {
			return { ...response, posts: []}
		}
		return response
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al actualizar la dinamica', action: 'show' });
		return null;
	}
};

export const remove = async (idSharePhoto: SharePhoto['_id']) => {
	try {
		const response = await SharePhotoApi.deleteOne(idSharePhoto)
		return true
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al eliminar la dinamica', action: 'show' })
		return null
	}
};

export const addPost = (idSharePhoto: SharePhoto['_id'], createPostDto: CreatePostDto) => {
	// if (sharePhotoData) {
	// 	const postsLength = sharePhotoData.posts.length;
	// 	const newPost: Post = {
	// 		_id: postsLength === 1 ? '1' : `${postsLength + 1}`,
	// 		created_at: new Date(),
	// 		updated_at: new Date(),
	// 		thumb: createPostDto.image,
	// 		likes: [],
	// 		...createPostDto,
	// 	};
	// 	sharePhotoData.posts.push(newPost);
	// 	return newPost;
	// }
	// return {};
};

export const addLike = (idSharePhoto: SharePhoto['_id'], idPost: Post['_id'], addLikeDto: AddLikeDto) => {
	// return {};
};
