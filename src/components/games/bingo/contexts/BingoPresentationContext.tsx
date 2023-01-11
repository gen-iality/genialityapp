import { createContext, ReactNode, useEffect, useState } from 'react';
import { BingoGame } from '../interfaces/bingo';
import * as services from '../services';

interface BingoPresentationContextType {
	bingoGame: BingoGame | null;
}

export const BingoPresentationContext = createContext({} as BingoPresentationContextType);

interface Props {
	children: ReactNode;
	eventId: string;
}

export default function BingoPresentationContextProvider(props: Props) {
	const { eventId, children } = props;
	const [bingoGame, setBingoGame] = useState<BingoGame | null>(null);

	useEffect(() => {
		const unsubscribe = services.bingoGamelistener(eventId, setBingoGame);
		return () => !!unsubscribe && unsubscribe();
	}, []);

	const values: BingoPresentationContextType = {
		bingoGame,
	};

	return <BingoPresentationContext.Provider value={values}>{children}</BingoPresentationContext.Provider>;
}
