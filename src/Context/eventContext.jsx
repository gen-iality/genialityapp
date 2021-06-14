import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { GetIdEvent } from '../helpers/utils';
import eventLanding from '../components/events/eventLanding';

export const CurrentEventContext = React.createContext();

//status: 'LOADING' | 'LOADED' | 'error'
let initialContextState = { status: 'LOADING', value: null };

export function CurrentEventProvider({ children }) {
  const [eventContext, setEventContext] = useState(initialContextState);
  let { event_id } = useParams();

  useEffect(() => {
    if (!event_id) return;
    async function fetchEvent() {
      console.log('CONTEXTOEVENTO eventid', event_id);
      const eventGlobal = await EventsApi.getOne(event_id);
      setEventContext({ status: 'LOADED', value: eventGlobal });
      console.log('CONTEXTOEVENTO---', eventGlobal);
    }
    fetchEvent();
  }, [event_id]);

  // const value = React.useMemo(() => {
  //   return {
  //     ...eventContext
  //   };
  // }, [eventContext]);

  return <CurrentEventContext.Provider value={eventContext}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
