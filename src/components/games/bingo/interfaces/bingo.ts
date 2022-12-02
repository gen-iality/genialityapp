export interface EventBingo {
	name?: string;
	_id?: string;
}
export interface Bingo {
	_id: string;
	name: string;
	bingo_appearance: BingoAppearance;
	amount_of_bingo: string;
	regulation: string;
	event_id: string;
	updated_at: string;
	created_at: string;
	ramdon_bingo_values: RamdonBingoValue[];
	bingo_values: BingoValue[];
	dimensions: DimensionInterface;
}
export interface CreateBingoProps {
	formDataBingo: any;
	setFormDataBingo: (data: any) => void;
	changeBingoDimensionsNew: (dimensions: DimensionInterface) => Promise<void>;
}
export interface AssignmentCardsProps {
	generateBingoForAllUsers: () => void;
	generateBingoForExclusiveUsers: () => void;
	listUsers: listUsers[];
	bingo: Bingo;
	bingoPrint: BingoPrintProps[];
}
export interface listUsers {
	bingo: boolean;
	_id: string;
	properties: {
		names: string;
		email: string;
		picture: string;
	};
}

export interface BingoAppearance {
	banner: string;
	footer: string;
	background_image: string;
	background_color: string;
	dial_image: string;
}

export interface BingoPrintProps {
	names: string;
	email: string;
	id: string;
	values: RamdonBingoValue[];
}

export interface RamdonBingoValue {
	carton_value: {
		type: string;
		value: string;
	};
	ballot_value: {
		type: string;
		value: string;
	};
}

export interface BingoValue {
	id: string;
	carton_value: {
		type: string;
		value: string;
	};
	ballot_value: {
		type: string;
		value: string;
	};
	map?: (arg0: (bingoValue: any, index: number) => any) => any;
}
export interface extraFields {
	label?: string;
	title?: string;
	key?: string;
	dataIndex?: string;
	type?: string;
	name: string;
	render?: (text: string, record: any, index: any) => React.ReactNode;
}
export interface ImportModalInterface {
	event: { name?: string; _id?: string };
	openAndCloseImportModal: boolean;
	setOpenAndCloseImportModal: (state: boolean) => void;
	extraFields: extraFields[];
	setFormData: (data: any) => void;
	formData: any;
	bingo: Bingo;
}
export interface importedItem {
	map: (data: any) => any;
	key: string;
	list: any[];
}
export interface ImportValuesInterface {
	key?: number;
	templateName: string;
	handleXls: (data: any) => any;
	extraFields: extraFields[];
	event: EventBingo;
	setEnableSaveButton: (state: boolean) => void;
	setImportData: (data: any) => void;
}

export interface FormDataBingoInterface {
	name: string;
	bingo_appearance: BingoAppearance;
	amount_of_bingo: number;
	regulation: string;
	bingo_values: BingoValue[];
	dimensions: DimensionInterface;
}

export interface Template {
	_id: string;
	title: string;
	format: string;
	image: string;
	index_to_validate: number[];
	updated_at: Date;
	created_at: Date;
}

export interface DataFirebaseBingoInterface {
	template: Template | null;
	bingoData: BingoDataInterface[];
	currentValue: PickedNumberInterface;
	demonstratedBallots: string[];
	startGame: boolean;
}

export interface BingoGame {
	template: Template | null;
	bingoData: BingoDataInterface[];
	currentValue: PickedNumberInterface;
	demonstratedBallots: string[];
	startGame: boolean;
}

export interface CreateBingoGameDto {
	template: Template | null;
	bingoData: BingoDataInterface[];
	currentValue: PickedNumberInterface;
	demonstratedBallots: string[];
	startGame: boolean;
}

export interface UpdateBingoGameDto extends Partial<CreateBingoGameDto> {}

export interface BingoDataInterface {
	active: boolean;
	ballot_value: string;
	carton_value: string;
	index: number;
	type: string;
}
export interface PlayBingoInterface {
	bingoValues: BingoValue[];
	event: EventBingo;
	notifications: any;
	dataFirebaseBingo: DataFirebaseBingoInterface;
	dimensions: DimensionInterface;
}
export interface SaveCurrentStateOfBingoInterface {
	event?: EventBingo;
	newList: any[];
	currentValue: PickedNumberInterface;
	demonstratedBallots: string[] | any[];
	startGame: boolean;
}
export interface BingoByUserInterface {
	_id: string;
	event_user_id: string;
	event_id: string;
	bingo_id: string;
	values_bingo_card: ValuesBingoCard[];
	updated_at: string;
	created_at: string;
	name_owner: string;
	bingo_card: any;
}

export interface ValuesBingoCard {
	carton_value: {
		type: string;
		value: string;
	};
	ballot_value: {
		type: string;
		value: string;
	};
	id: string;
}

export interface DrawerBingoInterface {
	openOrClose: boolean;
	setOpenOrClose: (state: boolean) => void;
}

export interface BallotHistoryModalInterface {
	openAndCloseBallotHistoryModal: boolean;
	setOpenAndCloseBallotHistoryModal: (state: boolean) => void;
}

export interface BallotHistoryInterface {
	demonstratedBallots: string[];
	mediaUrl?: string;
	renderingInCms?: boolean;
}
export interface DrawerHeaderInterface {
	cardboardCode: string;
	backgroundColor: string;
	color: string;
}
export interface DrawerButtonsInterface {
	arrayLocalStorage: number[];
	postBingoByUser: () => void;
	clearCarton: () => void;
	setshowDrawerChat?: (state: boolean) => void;
	setshowDrawerRules?: (state: boolean) => void;
	bingoData?: Bingo;
	closedrawer: () => void;
}
export interface CurrentBallotValueInterface {
	ballotValue: PickedNumberInterface;
	cEvent: any;
}
export interface BingoCardInterface {
	bingo: Bingo | undefined;
	arrayDataBingo: RamdonBingoValue[];
	arrayLocalStorage: number[];
	changeValueLocalStorage: (index: number) => void;
	getBingoListener: () => any;
	setOpenOrClose: (state: boolean) => void;
	isPrint?: boolean;
}

export interface PlayBingoHeaderInterface {
	bingoValues: BingoValue[];
	playing: boolean;
	pickedNumber: PickedNumberInterface;
	startGame: () => void;
	endGame: () => void;
	restartGame: () => void;
	dimensions: DimensionInterface;
}

export interface BallotDrawCardInterface {
	pickedNumber: PickedNumberInterface;

	playing: boolean;
	generateRandomBallot: () => void;
	disableBallotDrawButton?: boolean;
}
export interface PickedNumberInterface {
	type: string;
	value: string;
}

export interface BingoValuesAddStateInterface {
	event?: EventBingo;
	dataFirebaseBingo: DataFirebaseBingoInterface;
	bingoValues: BingoValue[];
	dimensions?: DimensionInterface;
}

export interface StartGameInterface {
	event?: EventBingo;
	dataFirebaseBingo: DataFirebaseBingoInterface;
	bingoValues: BingoValue[];
	dimensions?: DimensionInterface;
}
export interface RestartGameInterface {
	event: EventBingo;
	dataFirebaseBingo: DataFirebaseBingoInterface;
	bingoValues: BingoValue[];
}
export interface EndGameInterface {
	event: EventBingo;
	bingoValues: BingoValue[];
}

export interface NotificationItemInterface {
	cardId: string;
	names: string;
	time: Date;
	values_ballot: string[];
	values_bingo_card: string[];
	hasWon: boolean;
}
export interface ValidarBingoInterface {
	manualValidationId?: string;
	userNotification?: any;
	event: EventBingo;
	dimensions: DimensionInterface;
}

export interface WinnersValidationCardInterface {
	event: EventBingo;
	notifications: [];
	inputValidate: string;
	dimensions: DimensionInterface;
	setInputValidate: (state: any) => void;
	validarBingo: ({ userNotification }: ValidarBingoInterface) => void;
}

export interface BingoWinnerOrLoserInterface {
	title: string;
	type: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
	onOk: () => void;
}

export interface DrawerChatInterface {
	showDrawerChat: boolean;
	setshowDrawerChat: (state: any) => void;
}

export interface DrawerRulesInterface {
	showDrawerRules: boolean;
	setshowDrawerRules: (state: any) => void;
	bingoData?: Bingo;
}

export interface DimensionInterface {
	format: '3x3' | '4x4' | '5x5';
	amount: number;
	minimun_values: number;
}
