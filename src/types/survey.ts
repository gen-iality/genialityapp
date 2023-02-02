export interface SurveyInFirestore {
	id: string;
	hasMinimumScore: boolean;
	isOpened: boolean;
	allow_gradable_survey: boolean;
	time_limit: number;
	isPublished: boolean;
	displayGraphsInSurveys: boolean;
	eventId: string;
	name: string;
	rankingVisible: boolean;
	category: string;
	showNoVotos: boolean;
	allow_anonymous_answers: boolean;
	isGlobal: boolean;
	activity_id: string;
	freezeGame: boolean;
	minimumScore: number;
	openedQuorum?: number;
	openedTimestamp?: number;
	closedTimestamp?: number;
	closedQuorum?: number;
}

export interface SurveyInRealtimeDatabase {
	category: string;
	eventId: string;
	isPublished: boolean;
	isOpened: boolean;
	name: string;
	openedTimestamp?: number;
}

export type SurveyStatusLabel = 'unpublished' | 'published' | 'unopened' | 'opened' | 'closed' | 'finished';

export type SurveyStatus = { isPublished?: boolean, isOpened?: boolean };

export type SurveyStatusDto =
	| { isPublished: boolean }
	| { isOpened: boolean; openedTimestamp?: number; openedQuorum?: number }
	| { isOpened: boolean; closedTimestamp?: number; closedQuorum?: number };


export interface UsersWhoHaveConnected {
	isOnline: boolean;
	lastChange: number;
	voteWeight?: number;
}
