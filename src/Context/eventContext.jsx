import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsApi, eventTicketsApi } from '../helpers/request';

export const CurrentEventContext = React.createContext();

export function CurrentEventProvider({ children }) {
  let { event_id, event_name } = useParams();
  let eventNameFormated = null;
  let initialContextState = { status: 'LOADING', value: null, nameEvent: '' };

  if (event_name) {
    eventNameFormated = event_name.replaceAll('---', 'more');
    eventNameFormated = eventNameFormated.replaceAll('-', '%20');
    eventNameFormated = eventNameFormated.replaceAll('more', '"-"');
    console.log('formateado', eventNameFormated);
    initialContextState = { status: 'LOADING', value: null, nameEvent: event_name };
  }

  const [eventContext, setEventContext] = useState(initialContextState);

  useEffect(() => {
    async function fetchEvent(type) {
      let eventGlobal;
      let dataevent;
      switch (type) {
        case 'id':
          eventGlobal = await EventsApi.getOne(event_id);
          dataevent = { status: 'LOADED', value: eventGlobal, nameEvent: event_id };
          break;

        case 'name':
          eventGlobal = await EventsApi.getOneByNameEvent(eventNameFormated);
          dataevent = { status: 'LOADED', value: eventGlobal.data[0], nameEvent: event_name };
          break;
      }
      setEventContext(dataevent);
    }

    if (event_id) {
      fetchEvent('id');
    } else if (event_name) {
      fetchEvent('name');
    }
  }, [event_id, event_name]);

  return <CurrentEventContext.Provider value={eventContext}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
