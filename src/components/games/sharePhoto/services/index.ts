import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { SharePhotoApi } from '@/helpers/request';
import {
	AddLikeDto,
	CreatePostDto,
	CreateSharePhotoDto,
	GetPostByTitleDto,
	ListenLikesDto,
	Post,
	RemoveLikeDto,
	SharePhoto,
	UpdateSharePhotoDto,
} from '../types';

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

// -------------- Posts services ----------------- //
export const addPost = async (createPostDto: CreatePostDto, eventId: string) => {
	try {
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
			// .doc(createPostDto.event_user_id)
			.doc()
			// .doc(createPostDto.event_user_id)
			.set(newPost);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return null;
	}
};

export const removePost = async (deletePostDto: any) => {
	await firestore
		.collection('sharePhotoByEvent')
		.doc(deletePostDto.event_id)
		.collection('posts')
		.doc(deletePostDto.event_user_id)
		.delete();
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
		const posts = (await Promise.all(
			postsDoc.docs.map(async doc => {
				const likes = await doc.ref.collection('likes').get();

				return {
					id: doc.id,
					...doc.data(),
					likes: likes.docs.length,
				};
			})
		)) as Post[];
		return posts;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return [];
	}
};

export const getPostByTitle = async (getPostByTitleDto: GetPostByTitleDto) => {
	try {
		const postsDoc = await firestore
			.collection('sharePhotoByEvent')
			.doc(getPostByTitleDto.event_id)
			.collection('posts')
			.where('title', '>=', getPostByTitleDto.title)
			.where('title', '<=', getPostByTitleDto.title + '\uf8ff')
			.get();
		if (postsDoc.empty) {
			return [];
		}
		const posts = (await Promise.all(
			postsDoc.docs.map(async doc => {
				const likes = await doc.ref.collection('likes').get();

				return {
					id: doc.id,
					...doc.data(),
					likes: likes.docs.length,
				};
			})
		)) as Post[];
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
				Promise.all(
					postsDoc.docs.map(async doc => {
						const likes = await doc.ref.collection('likes').get();

						return {
							id: doc.id,
							...doc.data(),
							likes: likes.docs.length,
						};
					})
				).then(posts => setPosts(posts as Post[]));
			}
		});
	return unsubscribe;
};

// -------------- Likes services ----------------- //
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
				created_at: new Date().toISOString(),
				user_name: addLikeDto.user_name,
				picture: addLikeDto.picture,
			});
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al dar me gusta', action: 'show' });
		return null;
	}
};

export const removeLike = async (removeLikeDto: RemoveLikeDto) => {
	try {
		await firestore
			.collection('sharePhotoByEvent')
			.doc(removeLikeDto.event_id)
			.collection('posts')
			.doc(removeLikeDto.post_id)
			.collection('likes')
			.doc(removeLikeDto.event_user_id)
			.delete();
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al dar me gusta', action: 'show' });
		return null;
	}
};

export const listenLikes = async (listenLikesDto: ListenLikesDto, setLikes: any) => {
	return firestore
		.collection('sharePhotoByEvent')
		.doc(listenLikesDto.event_id)
		.collection('posts')
		.doc(listenLikesDto.post_id)
		.collection('likes')
		.onSnapshot(likesDocs => {
			if (likesDocs.empty) {
				console.log('No likes yet');
			} else {
				const likes = likesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				console.log(likes);
			}
		});
};
