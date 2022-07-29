import { useContext } from 'react';
import ActivityTypeContext from '../activityTypeContext';
import { ActivityTypeContextType } from '../types/types';

type hookType = ActivityTypeContextType;

export default function useActivityType (): hookType {
  const context = useContext(ActivityTypeContext);

  return {
    ...context,
  };
}
