import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { GetIdEvent } from '../helpers/utils';

export const CurrentEventContext = React.createContext();

export function CurrentEventProvider({ children }) {
  const [eventContext, seteventContext] = useState();

  useEffect(() => {
    async function fetchEvent() {
      let eventid = GetIdEvent();

      const eventGlobal = await EventsApi.getOne(eventid);
      seteventContext(eventGlobal);
      console.warn('CONTEXTOEVENTO---', eventContext);
    }
    fetchEvent();
  }, []);

  const value = React.useMemo(() => {
    return {
      ...eventContext
    };
  }, [eventContext]);

  return <CurrentEventContext.Provider value={value}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
