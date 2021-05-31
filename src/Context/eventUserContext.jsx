import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { GetIdEvent } from '../helpers/utils';

export const UsuarioContext = React.createContext();

export function UserEventProvider({ children }) {
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
      ...userEvent
    };
  }, [userEvent]);

  //

  return <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>;
}

export function UseUserEvent() {
  const contextuser = React.useContext(UsuarioContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
