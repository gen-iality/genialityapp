import { createContext } from 'react';
import { HelperContextProps } from './types/types';

export const HelperContext = createContext<HelperContextProps>({} as HelperContextProps);
