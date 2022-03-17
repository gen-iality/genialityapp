import React, { createContext } from 'react';
import { TypeActivityContextProps } from './types/types';

export const TypeActivityContext = createContext<TypeActivityContextProps>({} as TypeActivityContextProps);
