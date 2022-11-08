import { ReactNode, createContext, useState } from 'react';
import { WhereIs } from '../types';

interface WhereIsContextType {
	whereIs: WhereIs | null;
	setWhereIs: React.Dispatch<React.SetStateAction<WhereIs | null>>;
}

export const WhereIsContext = createContext<WhereIsContextType>({} as WhereIsContextType);

interface Props {
	children: ReactNode;
}

export default function WhereIsProvider(props: Props) {
	const [whereIs, setWhereIs] = useState<WhereIs | null>(null);
	return <WhereIsContext.Provider value={{ whereIs, setWhereIs }}>{props.children}</WhereIsContext.Provider>;
}
