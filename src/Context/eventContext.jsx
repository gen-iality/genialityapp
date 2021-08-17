import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsApi, eventTicketsApi } from '../helpers/request';

export const CurrentEventContext = React.createContext();

//status: 'LOADING' | 'LOADED' | 'error'
let initialContextState = { status: 'LOADING', value: null };

export function CurrentEventProvider({ children }) {
  const [eventContext, setEventContext] = useState(initialContextState);
  let { event_id } = useParams();

  useEffect(() => {
    if (!event_id) return;
    async function fetchEvent() {
      let eventGlobal = await EventsApi.getOne(event_id);
      //const ticketsEvent=await eventTicketsApi.getAll(event_id);
     // eventGlobal={...eventGlobal,tickets:ticketsEvent}

      setEventContext({ status: 'LOADED', value: eventGlobal });
    }
    fetchEvent();
  }, [event_id]);

  return <CurrentEventContext.Provider value={eventContext}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
