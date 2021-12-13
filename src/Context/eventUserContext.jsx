import React, { useState } from 'react';
import { useEffect } from 'react';
import privateInstance, { EventsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { app } from 'helpers/firebase';
import { UseCurrentUser } from './userContext';
export const CurrentEventUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  console.log('1. CUSER EVENT USER==>', cUser);

  const [userEvent, setuserEvent] = useState(initialContextState);
  let [updateUser, setUpdateUser] = useState(false);

  useEffect(() => {
    let event_id = cEvent.value?._id;
    console.log('1. EJECUTADO USEEFFECT1===>', cUser);
    if (cUser.value == null || cUser.value == undefined) return;
    // console.log('cambiar el envento', cEvent.value);
    console.log('1. EJECUTADO USEEFFECT2===>', cUser);
    async function asyncdata() {
      try {
        console.log('1. CUSER===>', cUser);
        EventsApi.getStatusRegister(event_id, cUser.value.email).then((responseStatus) => {
          console.log('responseStatus=>>', responseStatus);
          if (responseStatus.data.length > 0) {
            setuserEvent({ status: 'LOADED', value: responseStatus.data[0] });
          } else {
            setuserEvent({ status: 'LOADED', value: null });
          }
        });
      } catch (e) {
        setuserEvent({ status: 'LOADED', value: null });
      }
    }
    if (event_id) {
      updateUser = false;
      asyncdata();
    }
  }, [cEvent.value, cUser.value, updateUser]);

  return (
    <CurrentEventUserContext.Provider value={{ ...userEvent, setUpdateUser: setUpdateUser }}>
      {children}
    </CurrentEventUserContext.Provider>
  );
}

export function UseUserEvent() {
  const contextuser = React.useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
