import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { ReactNode, createContext, useState, useEffect } from 'react';
import { CreatePostDto, CreateSharePhotoDto, Like, Post, SharePhoto, UpdateSharePhotoDto } from '../types';
import * as service from '../services';
import { Score } from '../../common/Ranking/types';

interface SharePhotoContextType {
	sharePhoto: SharePhoto | null;
	loading: boolean;
	posts: Post[];
	filteredPosts: Post[];
	likes: Like[];
	postSelected: Post | null;
	scores: Score[];
	myScore: Score | null;
	setPostSelected: React.Dispatch<React.SetStateAction<Post | null>>;
	postsListener: () => () => void;
	deletePost: (postId: Post['id']) => void;
	likesListener: (postId: Post['id']) => () => void;
	createSharePhoto: (createSharePhotoDto: CreateSharePhotoDto) => Promise<void>;
	updateSharePhoto: (id: SharePhoto['_id'], updateSharePhotoDto: UpdateSharePhotoDto) => Promise<void>;
	deleteSharePhoto: (id: SharePhoto['_id']) => Promise<void>;
	createPost: (createPostDto: Omit<CreatePostDto, 'event_user_id' | 'picture' | 'user_name'>) => Promise<void>;
	addLike: (postId: Post['id']) => Promise<void>;
	handleLike: (postId: Post['id']) => Promise<void>;
	getPostByTitle: (stringSearch: string) => Promise<void>;
	listenSharePhoto: () => () => void;
	rankingListener: () => () => void;
	// postsListener:
}

export const SharePhotoContext = createContext<SharePhotoContextType>({} as SharePhotoContextType);

interface Props {
	children: ReactNode;
}

export default function SharePhotoProvider(props: Props) {
	const [sharePhoto, setSharePhoto] = useState<SharePhoto | null>(null);
	const [posts, setPosts] = useState<Post[]>([] as Post[]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([] as Post[]);
	const [postSelected, setPostSelected] = useState<Post | null>(null);
	const [likes, setLikes] = useState<Like[]>([] as Like[]);
	const [alreadyLiked, setAlreadyLiked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [scores, setScores] = useState<Score[]>([] as Score[]);
	const [myScore, setScore] = useState<Score | null>(null);
	// hooks
	const cUser = UseUserEvent();
	// console.log(cUser);
	// const cEvent = UseEventContext();
	const eventId = cUser?.value?.event_id;

	useEffect(() => {
		if (eventId && sharePhoto === null) {
			getSharePhoto();
			getPosts();
		}
		const unsubscribe = listenSharePhoto();
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (!scores.length && !!sharePhoto) {
			// console.log('fetch results');
			getRanking();
		}
	}, [sharePhoto]);

	const getSharePhoto = async () => {
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
			setSharePhoto(newSharePhoto);
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

	const listenSharePhoto = () => {
		if (cUser?.value?.event_id === undefined) return () => {};
		return service.listenSharePhoto(cUser.value.event_id, setSharePhoto);
	};

	// -------------- Posts hooks ----------------- //
	const createPost = async (createPostDto: Omit<CreatePostDto, 'event_user_id' | 'picture' | 'user_name'>) => {
		try {
			setLoading(true);
			if (sharePhoto === null || !sharePhoto._id) return;
			await service.addPost(
				{
					...createPostDto,
					event_user_id: cUser.value._id,
					picture: cUser.value.user.picture,
					user_name: cUser.value.user.names,
				},
				cUser.value.event_id
			);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getPosts = async () => {
		try {
			setLoading(true);
			const posts = await service.getPosts(eventId);
			setPosts(posts);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getPostByTitle = async (stringSearch: string) => {
		try {
			setLoading(true);
			const posts = await service.getPostByTitle({ event_id: eventId, title: stringSearch });
			// console.log(posts);
			setFilteredPosts(posts);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const deletePost = async (postId: string) => {
		try {
			setLoading(true);
			await service.removePost({ event_id: eventId, postId });
			setPostSelected(null);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const postsListener = () => {
		return service.getPostsListener(eventId, setPosts);
	};

	// -------------- Likes services ----------------- //
	const addLike = async (postId: Post['id']) => {
		try {
			setLoading(true);
			// console.log('giving like');
			await service.addLike({
				event_id: eventId,
				post_id: postId,
				event_user_id: cUser.value._id,
				picture: cUser.value.user.picture,
				user_name: cUser.value.user.names,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteLike = async (postId: Post['id']) => {
		try {
			setLoading(true);
			// console.log('removing like');
			await service.removeLike({
				event_id: eventId,
				post_id: postId,
				event_user_id: cUser.value._id,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleLike = async (postId: Post['id']) => {
		if (likes.map(like => like.id).includes(cUser.value._id)) {
			return await deleteLike(postId);
		} else {
			return await addLike(postId);
		}
	};

	const likesListener = (postId: Post['id']) => {
		return service.listenLikes({ event_id: eventId, post_id: postId }, setLikes);
	};

	// -------------- Ranking services ----------------- //
	const getRanking = async () => {
		try {
			setLoading(true);
			if (sharePhoto === null) return;
			// console.log('se ejecuta la query');
			const scores = await service.getRanking(eventId, sharePhoto?.points_per_like);
			setScores(scores);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const rankingListener = () => {
		return service.listenRanking(eventId, sharePhoto?.points_per_like || 1, setScores);
	};

	return (
		<SharePhotoContext.Provider
			value={{
				sharePhoto,
				posts,
				loading,
				postSelected,
				setPostSelected,
				createSharePhoto,
				updateSharePhoto,
				deleteSharePhoto,
				createPost,
				postsListener,
				addLike,
				getPostByTitle,
				likesListener,
				filteredPosts,
				likes,
				handleLike,
				listenSharePhoto,
				scores,
				myScore,
				deletePost,
				rankingListener,
			}}>
			{props.children}
		</SharePhotoContext.Provider>
	);
}
