import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsApi, eventTicketsApi } from '../helpers/request';

export const CurrentEventContext = React.createContext();

export function CurrentEventProvider({ children }) {
  let { event_id } = useParams();
  let eventNameFormated;
  let initialContextState = { status: 'LOADING', value: null, nameEvent: '' };

  if (event_id) {
    eventNameFormated = event_id.replaceAll('-', '%20');
    initialContextState = { status: 'LOADING', value: null, nameEvent: event_id };
  }

  const [eventContext, setEventContext] = useState(initialContextState);

  useEffect(() => {
    if (!event_id) return;
    async function fetchEvent() {
      let eventGlobal = await EventsApi.getOneByNameEvent(eventNameFormated);
      console.log('eventGlobal', eventGlobal);
      setEventContext({ status: 'LOADED', value: eventGlobal.data[0], nameEvent: event_id });
    }
    fetchEvent();
  }, []);

  return <CurrentEventContext.Provider value={eventContext}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
