import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
export const CurrentEventUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  let cEvent = UseEventContext();
  const [userEvent, setuserEvent] = useState(initialContextState);
  useEffect(() => {
    let event_id = cEvent.value?._id;

    if (!event_id) return;

    async function fetchEvent() {
      const eventUserGlobal = await EventsApi.getcurrentUserEventUser(event_id);
      setuserEvent({ status: 'LOADED', value: eventUserGlobal });
    }

    fetchEvent();
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
