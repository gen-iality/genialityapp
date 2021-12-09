import React, { useState } from 'react';
import { useEffect } from 'react';
import privateInstance, { EventsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { app } from 'helpers/firebase';
export const CurrentEventUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  let cEvent = UseEventContext();

  const [userEvent, setuserEvent] = useState(initialContextState);

  useEffect(() => {
    let event_id = cEvent.value?._id;
    async function asyncdata() {
      try {
        app.auth().onAuthStateChanged((user) => {
          if (user) {
            user.getIdToken().then(async function(idToken) {
              privateInstance.get(`/auth/currentUser?evius_token=${idToken}`).then((response) => {
                EventsApi.getStatusRegister(event_id, response.data.email).then((responseStatus) => {
                  // console.log('responseStatus=>>', responseStatus.data[0]);
                  setuserEvent({ status: 'LOADED', value: responseStatus.data[0] });
                });
              });
            });
          }
        });
      } catch (e) {
        setCurrentUser({ status: 'LOADING', value: null });
      }
    }
    asyncdata();
  }, [cEvent.value]);

  return <CurrentEventUserContext.Provider value={userEvent}>{children}</CurrentEventUserContext.Provider>;
}

export function UseUserEvent() {
  const contextuser = React.useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
