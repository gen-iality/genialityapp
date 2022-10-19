import { ReactNode, createContext } from 'react';
import { WhereIs } from '../types';

interface WhereIsContextType {
  sharePhoto: WhereIs | null;
}

export const WhereIsContext = createContext<WhereIsContextType>({} as WhereIsContextType);

const initialState = {
  sharePhoto: null,
};

interface Props {
  children: ReactNode;
}

export default function WhereIsProvider(props: Props) {
  return <WhereIsContext.Provider value={initialState}>{props.children}</WhereIsContext.Provider>;
}
