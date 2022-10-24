// Base type
export interface Base {
	_id: string;
	created_at: Date | string;
	updated_at: Date | string;
}

// Dynamic
export interface SharePhoto extends Base {
	// // Base
	// _id: string;
	// created_at: Date | string;
	// updated_at: Date | string;
	// Event Info
	event_id: string;
	title: string;
	tematic: {
		type: 'text' | 'image' | string
		content: string
	}
	// start_date: Date | string;
	// end_date: Date | string;
	// Event Status
	published: boolean;
	active: boolean;
	// Dynamic data
	points_per_like: number;
	posts: Post[];
}

export interface CreateSharePhotoDto
	extends Omit<
		SharePhoto,
		| '_id'
		| 'created_at'
		| 'updated_at'
		| 'tematic'
		| 'published'
		| 'active'
		| 'points_per_like'
		| 'posts'
	> {}

export interface UpdateSharePhotoDto
	extends Partial<Omit<SharePhoto, 'id' | 'created_at' | 'updated_at'>> {}

export interface Post extends Base {
	// // Base
	// _id: string;
	// created_at: Date | string;
	// updated_at: Date | string;
	// Dynamic info
	// dynamic_id: string;
	user_id: string;
	// Post data
	image: string;
	thumb: string;
	title: string;
	likes: Like[];
}

export interface CreatePostDto
	extends Omit<Post, '_id' | 'created_at' | 'updated_at' | 'thumb' | 'likes'> {}

export interface Like extends Base {
	// // Base
	// _id: string;
	// created_at: Date | string;
	// updated_at: Date | string;
	// Like data
	post_id: string;
	user_id: string;
}

export interface AddLikeDto
	extends Omit<Like, '_id' | 'created_at' | 'updated_at'> {}
