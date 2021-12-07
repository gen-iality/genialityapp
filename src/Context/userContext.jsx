import { app } from 'helpers/firebase';
import React, { useState } from 'react';
import { useEffect } from 'react';
import privateInstance, { getCurrentUser } from '../helpers/request';

export const CurrentUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialContextState);

  //seteando con el auth al current user || falta eventUser
  useEffect(() => {
    async function asyncdata() {
      try {
        app.auth().onAuthStateChanged((user) => {
          if (user) {
            user.getIdToken().then(async function(idToken) {
              privateInstance.get(`/auth/currentUser?evius_token=${idToken}`).then((response) => {
                setCurrentUser({ status: 'LOADED', value: response.data });
              });
            });
          }
        });
      } catch (e) {
        setCurrentUser({ status: 'ERROR', value: null });
      }
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
