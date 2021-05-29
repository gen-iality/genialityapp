import React, { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentUser } from '../helpers/request';

export const CurrentUserContext = React.createContext();

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    async function getUser() {
      let usercurrent = await getCurrentUser();
      console.log('USERCURRENT', usercurrent);
      setCurrentUser(usercurrent);
    }

    getUser();
  }, []);

  const value = React.useMemo(() => {
    return {
      ...currentUser,
    };
  }, [currentUser]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function UseCurrentUser() {
  const contextuser = React.useContext(CurrentUserContext);
  if (!contextuser) {
    throw new Error('currentUser debe estar dentro del proveedor');
  }

  return contextuser;
}
