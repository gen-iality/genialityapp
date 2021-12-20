import { app } from 'helpers/firebase';
import React, { useState } from 'react';
import { useEffect } from 'react';
import privateInstance from '../helpers/request';

export const CurrentUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: undefined };

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialContextState);

  //seteando con el auth al current user || falta eventUser
  useEffect(() => {
    async function asyncdata() {
      try {
        app.auth().onAuthStateChanged((user) => {
          console.log('USER LOGUEADO==>', user);
          if (!user?.isAnonymous && user) {
            user.getIdToken().then(async function(idToken) {
              privateInstance.get(`/auth/currentUser?evius_token=${idToken}`).then((response) => {
                setCurrentUser({ status: 'LOADED', value: response.data });
              });
            });
          } else if (user?.isAnonymous && user) {
            //OBTENERT USER

            console.log('USUARIO ANONIMO==>', user.displayName, user.name, user);
            const obtainDisplayName = () => {
              if (app.auth().currentUser.displayName != null) {
                setCurrentUser({
                  status: 'LOADED',
                  value: {
                    names: user.displayName,
                    email: 'email@email.com',
                    isAnonymous: true,
                    _id: user.uid,
                  },
                });
              } else {
                setTimeout(() => {
                  obtainDisplayName();
                }, 500);
              }
            };
            obtainDisplayName();
          } else {
            setCurrentUser({ status: 'LOADED', value: null });
          }
        });

        app.auth().isSignInWithEmailLink((user) => {
          if (user) {
            user.getIdToken().then(async function(idToken) {
              privateInstance.get(`/auth/currentUser?evius_token=${idToken}`).then((response) => {
                setCurrentUser({ status: 'LOADED', value: response.data });
              });
            });
          } else {
            setCurrentUser({ status: 'LOADED', value: null });
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
