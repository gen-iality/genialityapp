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
	publishedTimestamp?: number;
	openedTimestamp?: number;
}

export interface SurveyInRealtimeDatabase {
	category: string;
	eventId: string;
	isPublished: boolean;
	isOpened: boolean;
	name: string;
	publishedTimestamp?: number;
	openedTimestamp?: number;
}

export type SurveyStatusLabel = 'unpublished' | 'published' | 'unopened' | 'opened' | 'closed' | 'finished';

export type SurveyStatus = { isPublished?: boolean, isOpened?: boolean };

export type SurveyStatusDto =
	| { isPublished: boolean; publishedTimestamp: number }
	| { isOpened: boolean; openedTimestamp: number };
