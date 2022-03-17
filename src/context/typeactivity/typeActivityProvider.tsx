import React, { useReducer } from 'react';
import { TypeActivityContext } from './typeActivityContext';
import { initialState, typeActivityReducer } from './typeActivityReducer';

interface TypeActivityProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const TypeActivityProvider = ({ children }: TypeActivityProviderProps) => {
  const [typeActivityState, typeActivityDispatch] = useReducer(typeActivityReducer, initialState);

  const selectActivitySteps = (id: string) => {
    typeActivityDispatch({ type: 'toggleType', payload: { id } });
  };
  const closeModal = () => {
    typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
  };

  return (
    <TypeActivityContext.Provider value={{ typeActivityState, selectActivitySteps, closeModal }}>
      {children}
    </TypeActivityContext.Provider>
  );
};
