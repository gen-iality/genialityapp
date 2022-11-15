import { Post } from '../types';

export const orderPosts = (posts: Post[], type?: 'date' | 'likes') => {
	if (type === 'likes') return posts.sort((a, b) => b.likes - a.likes);
	return posts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};
