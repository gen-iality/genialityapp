import { app, firestore } from '../helpers/firebase';
import React, { useState } from 'react';
import { useEffect } from 'react';
import privateInstance from '../helpers/request';

export const CurrentUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: undefined };

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialContextState);
  const conectionRef = firestore.collection(`connections`);

  //seteando con el auth al current user || falta eventUser
  useEffect(() => {
    async function asyncdata() {
      try {
        app.auth().onAuthStateChanged((user) => {
          if (!user?.isAnonymous && user) {
            user.getIdToken().then(async function(idToken) {
              const lastSignInTime = (await user.getIdTokenResult()).authTime;
              privateInstance
                .get(`/auth/currentUser?evius_token=${idToken}`)
                .then(async (response) => {
                  if (response.data) {
                    conectionRef.doc(user.uid).set({
                      id: user?.uid,
                      email: user?.email,
                      lastSignInTime: lastSignInTime,
                    });
                    setCurrentUser({ status: 'LOADED', value: response.data });
                  } else {
                    setCurrentUser({ status: 'LOADED', value: null });
                  }
                })
                .catch((e) => {
                  //ESTE CATCH SIRVE PARA CUANDO SE CAMBIA DE STAGIN A PROD//USUARIOS QUE NO SE ENCUENTRAN EN LA OTRA BD
                  app
                    .auth()
                    .signOut()
                    .then(async (resp) => {
                      const docRef = await conectionRef.where('email', '==', app.auth().currentUser?.email).get();
                      if (docRef.docs.length > 0) {
                        //console.log('DOCUMENT ID==>', docRef.docs[0].id);
                        await conectionRef.doc(docRef.docs[0].id).delete();
                      }

                      setCurrentUser({ status: 'LOADED', value: null });
                    })
                    .catch(() => setCurrentUser({ status: 'LOADED', value: null }));
                });
            });
          } else if (user?.isAnonymous && user) {
            //OBTENERT USER
            const obtainDisplayName = () => {
              if (app.auth().currentUser.displayName != null) {
                /**para poder obtener el email y crear despues un eventUser se utiliza el parametro photoURL de firebas para almacenar el email */
                setCurrentUser({
                  status: 'LOADED',
                  value: {
                    names: user.displayName,
                    email: user.photoURL,
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
      } catch (e) {
        setCurrentUser({ status: 'ERROR', value: null });
      }
    }
    asyncdata();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ ...currentUser, setCurrentUser: setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function UseCurrentUser() {
  const contextuser = React.useContext(CurrentUserContext);
  if (!contextuser) {
    throw new Error('currentUser debe estar dentro del proveedor');
  }

  return contextuser;
}
