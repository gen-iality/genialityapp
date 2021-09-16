import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { useParams } from 'react-router-dom';
export const CurrentEventUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  const [userEvent, setuserEvent] = useState(initialContextState);
  let { event_id } = useParams();
  useEffect(() => {
    if (!event_id) return;
    async function fetchEvent() {
      const eventUserGlobal = await EventsApi.getcurrentUserEventUser(event_id);
      setuserEvent({ status: 'LOADED', value: eventUserGlobal });
    }

    fetchEvent();
  }, []);

  return <CurrentEventUserContext.Provider value={userEvent}>{children}</CurrentEventUserContext.Provider>;
}

export function UseUserEvent() {
  const contextuser = React.useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
