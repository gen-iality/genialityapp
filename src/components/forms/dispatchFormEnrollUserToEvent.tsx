import { useReducer } from 'react';
import { helperInitialState, helperReducer } from './reducerFormEnrollUserToEvent';

const dispatchFormEnrollUserToEvent = () => {
  const [formState, formDispatch] = useReducer(helperReducer, helperInitialState);

  const reducer = {
    formState,
    formDispatch,
  };

  return reducer;
};

export default dispatchFormEnrollUserToEvent;
