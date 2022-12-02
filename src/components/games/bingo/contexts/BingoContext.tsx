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
}

export const BingoContext = createContext<BingoContextType>({} as BingoContextType);

interface Props {
	children: ReactNode;
}

export default function BingoProvider(props: Props) {
	const [bingo, setBingo] = useState<Bingo | null>(null);
	const [bingoGame, setBingoGame] = useState<BingoGame | null>(null);
	const [templates, setTemplates] = useState<Template[]>([] as Template[]);
	const [templateSelected, setTemplateSelected] = useState<Template | null>(null);
	const [loading, setLoading] = useState(false);
	// Hooks
	const cUser = UseUserEvent();

	const eventId = cUser?.value?.event_id;

	useEffect(() => {
		if (eventId && !bingo) {
			getBingo();
		}
	}, []);

	useEffect(() => {
		if (bingo?.dimensions?.format && !templates.length) {
			getTemplates().then(templates => {
				if (templates.length) {
					setTemplateSelected(templates[0]);
				}
			});
		}
	}, [bingo]);

	// TODO: Just for test purposes - Remember to disabled in production
	useEffect(() => {
		console.log(templates);
		console.log(bingo);
	}, [templates, bingo]);

	const getBingo = async () => {
		try {
			setLoading(true);
			if (!eventId) return console.error('eventId missed');
			const bingo = await services.getBingo(eventId);
			setBingo(bingo as Bingo);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const getTemplates = async () => {
		try {
			setLoading(true);
			if (!bingo?.dimensions?.format) return console.error('Bingo missed');
			const templates = await services.getTemplates(bingo.dimensions.format);
			setTemplates(templates as Template[]);
			return templates;
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const chooseTemplate = (templateId: Template['_id']) => {
		try {
			setLoading(true);
			const template = templates.find(template => template._id === templateId);
			if (!template) return console.error('Template missed');
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

  const validateCardUserBingo = (userBallots: [], ballotsPlayed: [], template: Template) => {
    
  }

	const values: BingoContextType = {
		bingo,
		bingoGame,
		templates,
		templateSelected,
		loading,
		chooseTemplate,
	};

	return <BingoContext.Provider value={values}>{props.children}</BingoContext.Provider>;
}
