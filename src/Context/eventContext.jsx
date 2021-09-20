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
    eventNameFormated = event_name.replaceAll('-', '%20');
    initialContextState = { status: 'LOADING', value: null, nameEvent: event_name };
  }

  const [eventContext, setEventContext] = useState(initialContextState);

  useEffect(() => {
  

    async function fetchEvent(type) {
      let eventGlobal;
      let dataevent;
      switch (type) {
        case 'id':
          console.log('idevent');
          eventGlobal = await EventsApi.getOne(event_id);
          dataevent = { status: 'LOADED', value: eventGlobal, nameEvent: event_id };
          console.log("con id",dataevent);

          break;

        case 'name':
          eventGlobal = await EventsApi.getOneByNameEvent(eventNameFormated);
          console.log('name regue', eventGlobal.data[0]);
          dataevent = { status: 'LOADED', value: eventGlobal.data[0], nameEvent: event_name };
          break;
        
      }
      setEventContext(dataevent);
      console.log("dataevent",dataevent)
    }


    if (event_id) {
      console.log('entra aca', event_id);
      fetchEvent('id');
    } else if (event_name) {
      console.log('entra aca', event_name);
      fetchEvent('name');
    }


  }, [event_id,event_name]);

  return <CurrentEventContext.Provider value={eventContext}>{children}</CurrentEventContext.Provider>;
}

export function UseEventContext() {
  const contextevent = React.useContext(CurrentEventContext);
  if (!contextevent) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextevent;
}
