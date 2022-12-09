import { UseUserEvent } from '@/context/eventUserContext';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Bingo, BingoGame, Template } from '../interfaces/bingo';
import * as services from '../services';

interface BingoContextType {
	bingo: Bingo | null;
	bingoGame: BingoGame | null;
	templates: Template[];
	templateSelected: Template | null;
	loading: boolean;
	chooseTemplate: (templateId: Template['_id']) => void;
	dimensionChanged: () => void;
	reloadBingo: () => void;
}

export const BingoContext = createContext<BingoContextType>({} as BingoContextType);

interface Props {
	children: ReactNode;
}

const delay = (time: number = 1000) => new Promise(resolve => setTimeout(resolve, time));

export default function BingoProvider(props: Props) {
	const [bingo, setBingo] = useState<Bingo | null>(null);
	const [bingoGame, setBingoGame] = useState<BingoGame | null>(null);
	const [templates, setTemplates] = useState<Template[]>([] as Template[]);
	const [templateSelected, setTemplateSelected] = useState<Template | null>(null);
	const [loading, setLoading] = useState(false);
	const [dimensionChange, setDimensionChange] = useState(false);
	// Hooks
	const cUser = UseUserEvent();

	// console.log('context load');


	const eventId = cUser?.value?.event_id;

	useEffect(() => {
		console.log('bingoGame templateSelected Change')
	}, [templateSelected])


	useEffect(() => {
		let unsubscribe: () => void
		if (eventId && !bingo) {
			getBingo();
			unsubscribe = services.bingoGamelistener(eventId, setBingoGame)
		}
		return () => unsubscribe()
	}, []);

	useEffect(() => {
		if (bingo?.dimensions?.format && !templates.length) {
			getTemplates(bingo?.dimensions?.format).then(templates => {
				if (templates.length) {
					const defaultTemplate = templates.find(template => template.category === 'default');
					if (!bingoGame) {
						if (defaultTemplate) {
							setTemplateSelected(defaultTemplate);
						} else {
							setTemplateSelected(templates[0]);
						}
					} else {
						setTemplateSelected(bingoGame.template)
					}
				}
			});
		}
	}, [bingo]);

	useEffect(() => {
		// console.log('dimensionChange', dimensionChange);
		delay().then(() => {
			// console.log('Start reload dimensions');
			reloadBingo();
		});
	}, [dimensionChange]);

	// TODO: Just for test purposes - Remember to disabled in production
	useEffect(() => {
		// console.log('templates', templates);
		// console.log('bingo', bingo);
		// console.log('bingo format', bingo?.dimensions?.format);
	}, [templates, bingo, dimensionChange]);

	const getBingo = async () => {
		try {
			setLoading(true);
			if (!eventId) return console.error('eventId missed');
			const bingo = await services.getBingo(eventId);
			setBingo(bingo as Bingo);
			return bingo;
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const reloadBingo = async () => {
		try {
			setLoading(true);
			const bingo = (await getBingo()) as Bingo;
			await getTemplates(bingo.dimensions.format);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
			setDimensionChange(false);
		}
	};

	const getTemplates = async (format: string) => {
		try {
			setLoading(true);
			if (!bingo?.dimensions?.format) {
				console.error('Bingo missed');
				return [] as Template[];
			}
			const templates = (await services.getTemplates(format)) as Template[];
			if (Array.isArray(templates)) {
				setTemplates(templates);
			}
			return Array.isArray(templates) ? templates : [];
		} catch (error) {
			console.error(error);
			return [];
		} finally {
			setLoading(false);
		}
	};

	const chooseTemplate = (templateId: Template['_id']) => {
		try {
			setLoading(true);
			const template = templates.find(template => template._id === templateId);
			if (!template) return console.error('Template missed')
			console.log('bingoGame change template')
			setTemplateSelected(template);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(true);
		}
	};

	const startBingoGame = () => {
		try {
			setLoading(true);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const validateCardUserBingo = (userBallots: [], ballotsPlayed: [], template: Template) => { };

	const dimensionChanged = () => {
		setDimensionChange(true);
	};

	const values: BingoContextType = {
		bingo,
		bingoGame,
		templates,
		templateSelected,
		loading,
		chooseTemplate,
		dimensionChanged,
		reloadBingo,
	};

	return <BingoContext.Provider value={values}>{props.children}</BingoContext.Provider>;
}
