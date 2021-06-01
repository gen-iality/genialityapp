import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { GetIdEvent } from '../helpers/utils';

export const CurrentEventUserContext = React.createContext();

export function CurrentUserEventProvider({ children }) {
  const [userEvent, setuserEvent] = useState();

  useEffect(() => {
    async function fetchEventUser() {
      let eventid = GetIdEvent();

      const eventUser = await EventsApi.getcurrentUserEventUser(eventid);
      setuserEvent(eventUser);
    }
    fetchEventUser();
  }, []);

  const value = React.useMemo(() => {
    return {
      ...userEvent,
    };
  }, [userEvent]);

  //

  return <CurrentEventUserContext.Provider value={value}>{children}</CurrentEventUserContext.Provider>;
}

export function UseUserEvent() {
  const contextuser = React.useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
