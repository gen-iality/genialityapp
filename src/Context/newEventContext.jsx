import React, { createContext } from 'react';

export const cNewEventContext = createContext();

export const newEventProvider = ({ children }) => {
  return <cNewEventContext.Provider value={{}}>{children}</cNewEventContext.Provider>;
};
