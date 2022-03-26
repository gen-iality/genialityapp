import { useContext } from 'react';
import { TypeActivityContext } from '../typeActivityContext';

export const useTypeActivity = () => {
  const {
    typeActivityState,
    toggleActivitySteps,
    selectOption,
    closeModal,
    createTypeActivity,
    executer_stopStream,
  } = useContext(TypeActivityContext);

  const {
    openModal,
    disableNextButton,
    typeOptions,
    selectedKey,
    previewKey,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    data,
  } = typeActivityState;
  console.log('🚀 debug HOOK =================>', typeActivityState, '<=================');
  return {
    openModal,
    disableNextButton,
    typeOptions,
    toggleActivitySteps,
    selectOption,
    closeModal,
    selectedKey,
    data,
    previewKey,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    createTypeActivity,
    executer_stopStream,
  };
};
