import { createContext } from 'react';
import { TMillonaireContextProps } from '../interfaces/Millonaire';
const MillonaireCMSContext = createContext<TMillonaireContextProps>({} as TMillonaireContextProps);

export default MillonaireCMSContext;
