import { createContext } from 'react';
import { ActivityTypeContextType } from './types/contextType';

const ActivityTypeContext = createContext<ActivityTypeContextType>(
  {} as ActivityTypeContextType,
);

export default ActivityTypeContext;
