export interface SharePhoto {
	_id: string;
	created_at: Date | string;
	updated_at: Date | string;
	event_id: string;
	title: string;
	tematic: string | null;
	published: boolean;
	active: boolean;
	points_per_like: number;
}

export interface CreateSharePhotoDto
	extends Omit<
		SharePhoto,
		'_id' | 'created_at' | 'updated_at' | 'tematic' | 'published' | 'active' | 'points_per_like' | 'posts'
	> {}

export interface UpdateSharePhotoDto extends Partial<Omit<SharePhoto, 'id' | 'created_at' | 'updated_at'>> {}

export interface Post {
	id: string;
	created_at: Date | string;
	updated_at: Date | string;
	event_user_id: string;
	user_name: string;
	picture: string;
	image: string;
	thumb: string;
	title: string;
	likes: number;
}

export interface CreatePostDto extends Omit<Post, 'id' | 'created_at' | 'updated_at' | 'thumb' | 'likes'> {}

export interface Like {
	id: string;
	created_at: Date | string;
	post_id: string;
	user_name: string;
	picture: string;
}

export interface AddLikeDto extends Omit<Like, 'id' | 'created_at'> {
	event_user_id: string;
	event_id: string;
	post_id: string;
}

export interface RemoveLikeDto {
	event_user_id: string;
	event_id: string;
	post_id: string;
}

export interface ListenLikesDto {
	event_id: string;
	post_id: string;
}

export interface GetPostByTitleDto {
	event_id: string;
	title: string;
}
