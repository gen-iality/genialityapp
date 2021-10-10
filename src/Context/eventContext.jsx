import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsApi, eventTicketsApi } from '../helpers/request';
import NotFoundPage from './../components/notFoundPage';

export const CurrentEventContext = React.createContext();

export function CurrentEventProvider({ children }) {
  let { event_id, event_name, event } = useParams();

  let eventNameFormated = null;
  let initialContextState = { status: 'LOADING', value: null, nameEvent: event_name || "" };

  if (event_name) {
    eventNameFormated = event_name.replaceAll('---', 'more');
    eventNameFormated = eventNameFormated.replaceAll('-', '%20');
    eventNameFormated = eventNameFormated.replaceAll('more', '"-"');
    console.log('formateado', eventNameFormated);
    initialContextState = { error: null, status: 'LOADING', value: null, nameEvent: event_name };
  }

  const [eventContext, setEventContext] = useState(initialContextState);

  useEffect(() => {
    async function fetchEvent(type) {
      let eventGlobal;
      let dataevent;
      try {
        switch (type) {
          case 'id':
            
            eventGlobal = await EventsApi.getOne(event_id || event);
            console.log('eventGlobal', eventGlobal);
            if (eventGlobal) {
              dataevent = { status: 'LOADED', value: eventGlobal, nameEvent: event_id || event };
            } else {
              dataevent = { error:'Not Found',status: 'ERROR', value: null, nameEvent: null };
            }
            break;

          case 'name':
            eventGlobal = await EventsApi.getOneByNameEvent(eventNameFormated);
            console.log('eventGlobal==>', eventGlobal);
            if (eventGlobal.data.length) {
              dataevent = {  status: 'LOADED', value: eventGlobal.data[0], nameEvent: event_name };
            } else {
              dataevent = { error:'Not Found',status: 'ERROR', value: null, nameEvent: null };
            }
            break;
        }
        console.log('eventGlobalxxxx', eventGlobal);
        setEventContext(dataevent);
      } catch (e) {
        dataevent = { error: e.message, status: 'ERROR', value: null, nameEvent: null };
        setEventContext(dataevent);
      }
    }

    console.log('eventi',event_id,event)
    if (event_id || event) {
      console.log('EVENT==>', event);
      fetchEvent('id');
    } else if (event_name) {
      fetchEvent('name');
    }
  }, [event_id, event_name, event]);

  return (
    <CurrentEventContext.Provider value={eventContext}>
      {eventContext && eventContext.error && <NotFoundPage />}
      {eventContext && !eventContext.error && <>{children}</>}
    </CurrentEventContext.Provider>
  );
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
