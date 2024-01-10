import { createContext, useContext, useState, useEffect } from 'react';
import { EventsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { app } from '../helpers/firebase';
import { UseCurrentUser } from './userContext';
export const CurrentEventUserContext = createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  const [userEvent, setUserEvent] = useState(initialContextState);
  let [updateUser, setUpdateUser] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (!user?.isAnonymous && user) {
        setUpdateUser(true);
      }
    });
  }, []);

  useEffect(() => {
    let event_id = cEvent.value?._id;
    const fetchEventUser = async () => {
      if (cUser.status === 'LOADED' && cEvent.status === 'LOADED') {
        if (!!cUser.value || updateUser !== false) {
          setUserEvent((currentValue) => ({ ...currentValue, status: 'LOADING' }));
          try {
            EventsApi.getStatusRegister(event_id, cUser.value.email).then((responseStatus) => {
              if (responseStatus.data.length > 0) {
                setUserEvent({ status: 'LOADED', value: responseStatus.data[0] });
              } else {
                setUserEvent({ status: 'LOADED', value: null });
              }
              setUpdateUser(false);
            });
          } catch (e) {
            setUserEvent({ status: 'LOADED', value: null });
            setUpdateUser(false);
          }
        } else {
          setUserEvent((currentValue) => ({ ...currentValue, status: 'LOADED' }));
        }
      }
    };

    if (!event_id) return;
    fetchEventUser();
  }, [cEvent.value, cUser.value, updateUser, cUser.status]);

  return (
    <CurrentEventUserContext.Provider
      value={{
        ...userEvent,
        setuserEvent: setUserEvent,
        setUpdateUser: setUpdateUser,
      }}>
      {children}
    </CurrentEventUserContext.Provider>
  );
}

export function UseUserEvent() {
  const contextuser = useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('UseEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
