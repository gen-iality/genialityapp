import React, { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentUser } from '../helpers/request';

export const CurrentUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };
export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialContextState);

  useEffect(() => {
    
    async function asyncdata ()  {
    let dataUser = await getCurrentUser();
    setCurrentUser({ status: 'LOADED', value: dataUser });
    }
    asyncdata();

  }, []);

  return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
}

export function UseCurrentUser() {
  const contextuser = React.useContext(CurrentUserContext);
  if (!contextuser) {
    throw new Error('currentUser debe estar dentro del proveedor');
  }

  return contextuser;
}
