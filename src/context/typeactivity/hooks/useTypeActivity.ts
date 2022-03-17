import { useContext } from 'react';
import { TypeActivityContext } from '../typeActivityContext';

export const useTypeActivity = () => {
  const { typeActivityState, selectActivitySteps, closeModal } = useContext(TypeActivityContext);
  const { activityOptions, openModal } = typeActivityState;
  return {
    openModal,
    closeModal,
    activityOptions,
    selectActivitySteps,
  };
};
