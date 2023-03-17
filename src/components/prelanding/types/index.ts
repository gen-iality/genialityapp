export interface LandingBlock {
	index: number;
	key: string;
	name: string;
	label? : string;
	status: number;
}

export interface Alias {
	[key : string] : string 
}
export interface DataSource {
	created_at: string;
	event_id: string;
	updated_id: string;
	_id: string;
	main_landing_blocks: LandingBlock[];
}
