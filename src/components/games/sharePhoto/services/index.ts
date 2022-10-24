import {
	AddLikeDto,
	CreatePostDto,
	CreateSharePhotoDto,
	Post,
	SharePhoto,
	UpdateSharePhotoDto,
} from '../types';

let sharePhotoData: SharePhoto | null = null;

const initialSharePhoto = {
	_id: '1',
	created_at: new Date(),
	updated_at: new Date(),
	event_id: '',
	title: '',
	tematic: {
		type: 'text',
		content: '',
	},
	// start_date: new Date(),
	// end_date: new Date(),
	published: false,
	active: false,
	points_per_like: 1,
	posts: [],
};

export const get = () => {};

export const create = (
	createSharePhotoDto: CreateSharePhotoDto
): SharePhoto => {
	sharePhotoData = {
		...initialSharePhoto,
		event_id: createSharePhotoDto.event_id,
		title: createSharePhotoDto.title,
	};
	return sharePhotoData;
};

export const update = (
	updateSharePhotoDto: UpdateSharePhotoDto
): SharePhoto => {
	if (sharePhotoData) {
		return {
			...sharePhotoData,
			...updateSharePhotoDto,
		};
	}
	return {
		...initialSharePhoto,
		...updateSharePhotoDto,
	};
};

export const remove = (idSharePhoto: SharePhoto['_id']) => {
	sharePhotoData = null;
	return sharePhotoData;
};

export const addPost = (
	idSharePhoto: SharePhoto['_id'],
	createPostDto: CreatePostDto
) => {
	if (sharePhotoData) {
		const postsLength = sharePhotoData.posts.length;
		const newPost: Post = {
			_id: postsLength === 1 ? '1' : `${postsLength + 1}`,
			created_at: new Date(),
			updated_at: new Date(),
			thumb: createPostDto.image,
			likes: [],
			...createPostDto,
		};
		sharePhotoData.posts.push(newPost);
		return newPost;
	}
	return {};
};

export const addLike = (
	idSharePhoto: SharePhoto['_id'],
	idPost: Post['_id'],
	addLikeDto: AddLikeDto
) => {
	return {};
};
