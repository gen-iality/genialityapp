import { createContext, ReactNode, useEffect, useState } from 'react';
import { Bingo, BingoGame } from '../interfaces/bingo';
import * as services from '../services';

interface BingoPresentationContextType {
	bingoGame: BingoGame | null;
	bingo: Bingo | null
}

export const BingoPresentationContext = createContext({} as BingoPresentationContextType);

interface Props {
	children: ReactNode;
	eventId: string;
}

export default function BingoPresentationContextProvider(props: Props) {
	const { eventId, children } = props;
	const [bingoGame, setBingoGame] = useState<BingoGame | null>(null);
	const [loading, setLoading] = useState(false);
	const [bingo, setBingo] = useState<Bingo | null>(null);

	useEffect(() => {
		if(eventId) {
			getBingo()
		}
		const unsubscribe = services.bingoGamelistener(eventId, setBingoGame);
		return () => !!unsubscribe && unsubscribe();
	}, []);

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

	const values: BingoPresentationContextType = {
		bingoGame,
		bingo
	};

	return <BingoPresentationContext.Provider value={values}>{children}</BingoPresentationContext.Provider>;
}