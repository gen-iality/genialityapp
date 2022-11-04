// // Base type
// export interface Base {
// 	_id: string;
// 	created_at: Date | string;
// 	updated_at: Date | string;
// }

// // Dynamic
// export interface WhereIs extends Base {
// 	event_id: string;
// 	title: string;
// 	start_date: Date | string;
// 	end_date: Date | string;

// 	published: boolean;
// 	active: boolean;

// 	points_per_like: number;
// 	posts: Post[];
// }

// export interface CreateWhereIsDto
// 	extends Omit<
// 		WhereIs,
// 		| 'id'
// 		| 'created_at'
// 		| 'updated_at'
// 		| 'start_date'
// 		| 'end_date'
// 		| 'published'
// 		| 'active'
// 		| 'points_per_like'
// 		| 'posts'
// 	> {}

// export interface UpdateWhereIsDto extends Partial<Omit<WhereIs, 'id' | 'created_at' | 'updated_at'>> {}

// export interface Post extends Base {
// 	dynamic_id: string;
// 	user_id: string;
// 	image: string;
// 	thumb: string;
// 	title: string;
// }

export interface WhereIs {
	id: string;
	created_at: Date | string;
	updated_at: Date | string;
	event_id: string;
	published: boolean;
	active: boolean;
	title: string;
	lifes: number;
	game_image: string;
	game_image_width: number;
	game_image_height: number;
	points: Point[];
	players: Player[];
}

export interface Point {
	id: string;
	label: string;
	image: string;
	x: number;
	y: number;
	radius: number;
}

export interface PointInGame extends Point {
	stroke: undefined | string;
	isFound: boolean;
}
export interface Player {
	created_at: string;
	updated_at: string;
	isFinish: boolean;
	duration: number;
	dynamic_id: string;
	event_user_id: string;
	user_name: string;
	picture: string;
}
export interface CreatePlayerDto extends Player {
	event_id: string;
}

export interface WhereIsGame {
	// id: string;
	duration: number;
	won: boolean;
	isFinish: boolean;
	dynamic_id: string;
	event_user_id: string;
	user_name: string;
	picture: string;
	lifes: number;
	points: PointInGame[];
}
