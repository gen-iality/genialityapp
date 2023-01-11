export interface WhereIs {
	_id: string;
	created_at: Date | string;
	updated_at: Date | string;
	event_id: string;
	published: boolean;
	instructions: string;
	active: boolean;
	title: string;
	lifes: number;
	game_image: string;
	game_image_width: number;
	game_image_height: number;
	points?: Point[]
}

export interface CreateWhereIsDto
	extends Omit<
		WhereIs,
		| '_id'
		| 'created_at'
		| 'updated_at'
		| 'published'
		| 'active'
		| 'lifes'
		| 'game_image'
		| 'game_image_width'
		| 'game_image_height'
	> {}


export interface UpdateWhereIsDto extends Partial<Omit<WhereIs, '_id' | 'created_at' | 'updated_at'>> {}
export interface Point {
	id: string;
	created_at: string;
	updated_at: string;
	label: string;
	image: string;
	x: number;
	y: number;
	radius: number;
}

export interface CreatePointDto extends Omit<Point, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdatePointDto extends Partial<CreatePointDto> {}

export interface UpdatePointsDto extends UpdatePointDto { id: Point['id'] }

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
