import React, { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { GetIdEvent } from '../helpers/utils';

const EventContext = React.createContext();

export function EventProvider({ children }) {
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
      ...eventContext,
    };
  }, [eventContext]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function UserEventContext() {
  const contextevent = React.useContext(EventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
