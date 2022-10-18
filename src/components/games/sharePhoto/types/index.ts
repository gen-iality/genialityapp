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
	start_date: Date | string;
	end_date: Date | string;
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
		| 'id'
		| 'created_at'
		| 'updated_at'
		| 'start_date'
		| 'end_date'
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
	dynamic_id: string;
	user_id: string;
	// Post data
	image: string;
	thumb: string;
	title: string;
	like: Like[];
}

export interface CreatePostDto
	extends Omit<Post, 'id' | 'created_at' | 'updated_at'> {}

export interface Like extends Base {
	// // Base
	// _id: string;
	// created_at: Date | string;
	// updated_at: Date | string;
	// Like data
	user_id: string;
}

export interface CreateLikeDto
	extends Omit<Like, 'id' | 'created_at' | 'updated_at'> {}
