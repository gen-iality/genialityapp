import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { SharePhotoApi } from '@/helpers/request';
import { Score } from '../../common/Ranking/types';
import {
	AddLikeDto,
	CreatePostDto,
	CreateSharePhotoDto,
	GetPostByTitleDto,
	Like,
	ListenLikesDto,
	Post,
	RemoveLikeDto,
	SharePhoto,
	UpdateSharePhotoDto,
} from '../types';
import { findScoreAndUpdate } from '../utils/findScoreAndUpdate';
import { orderPosts } from '../utils/orderPosts';
import { postToScore } from '../utils/postToScore';

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
			if (doc.exists) {
				setSharePhoto(doc.data() as SharePhoto);
			} else {
				console.log('No data yet');
			}
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
			.doc(createPostDto.event_user_id)
			// .doc()
			.set(newPost);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear publicación', action: 'show' });
		return null;
	}
};

export const removePost = async (deletePostDto: { event_id: string; postId: string }) => {
	const likesDoc = await firestore
		.collection('sharePhotoByEvent')
		.doc(deletePostDto.event_id)
		.collection('posts')
		.doc(deletePostDto.postId)
		.collection('likes')
		.get();

	const likes = likesDoc.docs.map(doc => doc.id);

	await Promise.all(
		likes.map(async likeId => {
			return await firestore
				.collection('sharePhotoByEvent')
				.doc(deletePostDto.event_id)
				.collection('posts')
				.doc(deletePostDto.postId)
				.collection('likes')
				.doc(likeId)
				.delete();
		})
	);

	await firestore
		.collection('sharePhotoByEvent')
		.doc(deletePostDto.event_id)
		.collection('posts')
		.doc(deletePostDto.postId)
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
		return orderPosts(posts);
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
				// console.log('No posts yet');
				setPosts([]);
			} else {
				Promise.all(
					postsDoc.docs.map(async doc => {
						const likes = await doc.ref.collection('likes').get();

						return {
							id: doc.id,
							...doc.data(),
							likes: likes.docs.length,
						} as Post;
					})
				).then(posts => {
					const orderedPosts = orderPosts(posts);
					setPosts(orderedPosts);
				});
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
				post_id: addLikeDto.post_id,
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

export const listenLikes = (listenLikesDto: ListenLikesDto, setLikes: React.Dispatch<React.SetStateAction<Like[]>>) => {
	return firestore
		.collection('sharePhotoByEvent')
		.doc(listenLikesDto.event_id)
		.collection('posts')
		.doc(listenLikesDto.post_id)
		.collection('likes')
		.onSnapshot(likesDocs => {
			if (likesDocs.empty) {
				setLikes([]);
			} else {
				const likes = likesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Like[];
				setLikes(likes);
			}
		});
};

// -------------- Ranking services ----------------- //
export const getRanking = async (eventId: string, points_per_like: number) => {
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

		const scores: Score[] = posts
			.sort((b, a) => a.likes - b.likes)
			.map((post, index) => ({
				uid: post.id,
				imageProfile: post.picture,
				name: post.user_name,
				index: index + 1,
				score: `${post.likes * points_per_like}`,
			}));
		// console.log(scores);
		return scores;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al dar me gusta', action: 'show' });
		return [];
	}
};

export const listenRanking = (
	eventId: string,
	points_per_like: number,
	setScores: React.Dispatch<React.SetStateAction<Score[]>>
) => {
	return firestore
		.collection('sharePhotoByEvent')
		.doc(eventId)
		.collection('posts')
		.onSnapshot(postsDoc => {
			if (postsDoc.empty) {
				setScores([]);
			} else {
				// It update when post is created
				Promise.all(
					postsDoc.docs.map(async doc => {
						const likes = await doc.ref.collection('likes').get();

						return {
							id: doc.id,
							...doc.data(),
							likes: likes.docs.length,
						} as Post;
					})
				).then(posts => {
					const score = orderPosts(posts, 'likes').map((post, index) => postToScore(post, index, points_per_like));
					setScores(score);
				});
				// It update when a like is added or removed
				postsDoc.docs.map(postDoc => {
					postDoc.ref.collection('likes').onSnapshot(likesDoc => {
						if (likesDoc.empty) {
							// console.log(`Find score with uid: ${postDoc.id} and replace its likes for 0`);

							setScores(prevScore => findScoreAndUpdate(prevScore, postDoc.id, 0));
						} else {
							// console.log(likesDoc.docs.length)
							// console.log(`Find score with uid: ${postDoc.id} and replace its likes for ${likesDoc.docs.length}`);
							setScores(prevScore => findScoreAndUpdate(prevScore, postDoc.id, likesDoc.docs.length * points_per_like));
						}
					});
				});
			}
		});
};
