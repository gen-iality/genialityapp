import { useState } from 'react';
import { useEffect } from 'react';
import { EventsApi } from '@helpers/request';
import { useEventContext } from './eventContext';
import { app } from '@helpers/firebase';
import { useCurrentUser } from './userContext';
export const CurrentEventUserContext = React.createContext();
let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserEventProvider({ children }) {
  let cEvent = useEventContext();
  let cUser = useCurrentUser();
  const [userEvent, setuserEvent] = useState(initialContextState);
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
    if (cUser.value == null || cUser.value == undefined || updateUser == false) return;
    async function asyncdata() {
      try {
        EventsApi.getStatusRegister(event_id, cUser.value.email).then((responseStatus) => {
          console.log('responseStatus ', responseStatus, 'upadateUser ', updateUser);
          if (responseStatus.data.length > 0) {
            setuserEvent({ status: 'LOADED', value: responseStatus.data[0] });
          } else {
            setuserEvent({ status: 'LOADED', value: null });
          }
          setUpdateUser(false);
        });
      } catch (e) {
        setuserEvent({ status: 'LOADED', value: null });
        setUpdateUser(false);
      }
    }

    if (!event_id) return;
    asyncdata();
  }, [cEvent.value, cUser.value, updateUser]);

  return (
    <CurrentEventUserContext.Provider
      value={{
        ...userEvent,
        setuserEvent: setuserEvent,
        setUpdateUser: setUpdateUser,
      }}>
      {children}
    </CurrentEventUserContext.Provider>
  );
}

export function useUserEvent() {
  const contextuser = React.useContext(CurrentEventUserContext);
  if (!contextuser) {
    throw new Error('useEventuser debe estar dentro del proveedor');
  }

  return contextuser;
}
