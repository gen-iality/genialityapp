import { createContext } from 'react';
import { ActivityTypeContextType } from './types/types';

const ActivityTypeContext = createContext<ActivityTypeContextType>(
  {} as ActivityTypeContextType,
);

export default ActivityTypeContext;
