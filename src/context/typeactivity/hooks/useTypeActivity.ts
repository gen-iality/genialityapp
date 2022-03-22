import { useContext } from 'react';
import { TypeActivityContext } from '../typeActivityContext';

export const useTypeActivity = () => {
  const { typeActivityState, toggleActivitySteps, selectOption, closeModal, createTypeActivity } = useContext(
    TypeActivityContext
  );

  const {
    openModal,
    disableNextButton,
    typeOptions,
    selectedKey,
    previewKey,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
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
    previewKey,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    createTypeActivity,
  };
};
