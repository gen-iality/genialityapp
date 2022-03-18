import React, { useReducer } from 'react';
import { TypeActivityContext } from './typeActivityContext';
import { initialState, typeActivityReducer } from './typeActivityReducer';

interface TypeActivityProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const TypeActivityProvider = ({ children }: TypeActivityProviderProps) => {
  const [typeActivityState, typeActivityDispatch] = useReducer(typeActivityReducer, initialState);

  const selectActivitySteps = (id: string) => {
    switch (id) {
      case 'type':
        typeActivityDispatch({ type: 'toggleType', payload: { id } });
        break;
      case 'provider':
        typeActivityDispatch({ type: 'toggleProvider', payload: { id } });
        break;
      case 'origin':
        typeActivityDispatch({ type: 'toggleOrigin', payload: { id } });
        break;

      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
        break;
    }
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
