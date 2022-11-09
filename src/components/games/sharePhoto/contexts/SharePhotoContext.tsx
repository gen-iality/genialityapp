import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { ReactNode, createContext, useState, useEffect } from 'react';
import { CreatePostDto, CreateSharePhotoDto, Like, Post, SharePhoto, UpdateSharePhotoDto } from '../types';
import * as service from '../services';

interface SharePhotoContextType {
	sharePhoto: SharePhoto | null;
	loading: boolean;
	posts: Post[];
	createSharePhoto: (createSharePhotoDto: CreateSharePhotoDto) => Promise<void>;
	updateSharePhoto: (id: SharePhoto['_id'], updateSharePhotoDto: UpdateSharePhotoDto) => Promise<void>;
	deleteSharePhoto: (id: SharePhoto['_id']) => Promise<void>;
	createPost: (createPostDto: Omit<CreatePostDto, 'event_user_id' | 'picture' | 'user_name'>) => Promise<void>;
	addLike: (postId: Post['id']) => Promise<void>;
	// listenSharePhoto: () => void;
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
	// hooks
	const cUser = UseUserEvent();
	// console.log(cUser);
	// const cEvent = UseEventContext();
	const eventId = cUser.value.event_id;

	useEffect(() => {
		if (eventId && sharePhoto === null) {
			getSharePhoto();
			getPosts();
		}
		// TODO: Move to specific component
		const unsubscribe = service.getPostsListener(eventId, setPosts);
		return unsubscribe;
	}, []);

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

	// Fix from here
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

	// const postsListener = () => {
	// 	const unsubscribe = service.getPostsListener(eventId, setPosts)
	// 	return unsubscribe
	// }

	const addLike = async (postId: Post['id']) => {
		try {
			setLoading(true);
			// if (sharePhoto === null || !sharePhoto._id) return;
			// const response = await service.addLike(sharePhoto._id, postId, {
			// 	event_user_id: cUser.value._id,
			// });
			// return response;
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	// const listenSharePhoto = () => {
	// 	const unSubscribe = service.listenSharePhoto(cUser.value.event_id, setSharePhoto);
	// 	return unSubscribe;
	// };

	return (
		<SharePhotoContext.Provider
			value={{
				sharePhoto,
				posts,
				loading,
				createSharePhoto,
				updateSharePhoto,
				deleteSharePhoto,
				createPost,
				addLike,
				// listenSharePhoto,
			}}>
			{props.children}
		</SharePhotoContext.Provider>
	);
}
