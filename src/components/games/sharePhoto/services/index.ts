import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { SharePhotoApi } from '@/helpers/request';
import { AddLikeDto, CreatePostDto, CreateSharePhotoDto, Post, SharePhoto, UpdateSharePhotoDto } from '../types';

export const get = async (eventId: string): Promise<SharePhoto | null> => {
	try {
		const response = await SharePhotoApi.getOne(eventId);
		if (response._id) {
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
		await firestore
			.collection('sharePhotoByEvent')
			.doc(createSharePhotoDto.event_id)
			.set(response);
		return response;
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
		await firestore
			.collection('sharePhotoByEvent')
			.doc(response.event_id)
			.update(response);
		return response;
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

// Fix from here
export const addPost = async (createPostDto: CreatePostDto, eventId: string) => {
	try {
		// const response = await SharePhotoApi.addOnePost(sharePhotoId, createPostDto);
		const newPost = {
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			event_user_id: createPostDto.event_user_id,
			user_name: createPostDto.user_name,
			picture: createPostDto.picture,
			image: createPostDto.image,
			thumb: createPostDto.image,
			title: createPostDto.title,
		};
		await firestore
			.collection('sharePhotoByEvent')
			.doc(eventId)
			.collection('posts')
			.doc(createPostDto.event_user_id)
			.set(newPost);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return null;
	}
};

export const getPosts = async (eventId: string) => {
	try {
		const postsDoc = await firestore
			.collection('sharePhotoByEvent')
			.doc(eventId)
			.collection('posts')
			.get();
		if (postsDoc.empty) {
			return [];
		}
		const posts = postsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
		return posts;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return [];
	}
};

export const getPostsListener = (eventId: string, setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
	const unsubscribe = firestore
		.collection('sharePhotoByEvent')
		.doc(eventId)
		.collection('posts')
		.onSnapshot(postsDoc => {
			if (postsDoc.empty) {
				console.log('No posts yet');
			} else {
				const posts = postsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
				console.log(posts);
				setPosts(posts);
			}
		});
	return unsubscribe;
};

export const addLike = async (addLikeDto: AddLikeDto) => {
	try {
		await firestore
			.collection('sharePhotoByEvent')
			.doc(addLikeDto.event_id)
			.collection('posts')
			.doc(addLikeDto.post_id)
			.collection('likes')
			.doc(addLikeDto.event_user_id)
			.set({
				created_at: new Date(),
				user_name: addLikeDto.user_name,
				picture: addLikeDto.picture,
			});
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
		.onSnapshot(doc => {
			console.log(doc);
		});
	return unSubscribe;
};
