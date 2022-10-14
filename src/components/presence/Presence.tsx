/* eslint no-console: error */
import firebase from 'firebase/compat/app';

import { useEffect, useState } from 'react';

import { createSessionPayload, destroySessionPayload } from './utils';

export interface PresenceProps<T> {
  data?: T,
  // Firebase stuffs
  realtimeDB: firebase.database.Database,
  // Loggers
  debuglog: (...args: any[]) => void;
  errorlog: (...args: any[]) => void;
  collectionNameCreator: () => { collectionName: string, childName: string };
  /**
   * This prop enable us to configure as a global presence manager, and avoid
   * disconnect the session when the component gets be unmounted.
   * 
   * NOTE: The component in global mode should be rendered only once.
   */
  global?: boolean;
};

function Presence<T = any>(props: PresenceProps<T>) {
  /* eslint-disable no-console */
  const {
    debuglog: LOG = console.debug,
    errorlog: ERROR = console.error,
  } = props;
  /* eslint-enable no-console */

  const {
    realtimeDB,
    global: isGlobal,
    data,
  } = props;

  const [payload, setPayload] = useState(createSessionPayload<T>(data));
  const [isDeactive, setIsDeactive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  let presenceRef: firebase.database.Reference;
  let userSessionsRealtime: firebase.database.Reference;
  let beaconRealtime: firebase.database.Reference | undefined;
  let onDisconnect: firebase.database.OnDisconnect;

  const sessionHandler = async (isConnected: boolean) => {
    if (isConnected) {
      LOG('it is online');
      setIsConnected(true);

      // Get the path in realtime
      LOG('reset the collection path');
      const { collectionName, childName } = props.collectionNameCreator();
      userSessionsRealtime = realtimeDB.ref(`/user_sessions/${collectionName}`).child(childName).push();

      if (isGlobal) {
        beaconRealtime = realtimeDB.ref(`/user_sessions/beacon`).child(childName);

        // Check if the beacon is false to set true
        const data = await beaconRealtime.get();
        const beacon = data.exists() && data.val();
        if (!beacon) {
          LOG('restore the beacon to true globally');

          // If it is global mode and the blocker is define, we have to set
          // in false when globally gets disconnected
          try {
            await beaconRealtime.onDisconnect().set(false);
          } catch (err) {
            ERROR('tried set a value in disconnection for userSessionsRealtimeBlocker:', err);
          }

          try {
            await beaconRealtime.set(true);
          } catch (err) {
            ERROR('tried to set beacon as true in false-found-value', err);
          }
        }        
      }

      // Get this object to save a value when the FB gets be disconnected
      onDisconnect = userSessionsRealtime.onDisconnect();
      // Save the disconnection value
      try {
        await onDisconnect.update(destroySessionPayload(payload));
      } catch (err) {
        ERROR('tried set a value in disconnection for userSessionsRealtime:', err);
      }
      // Mask as connected
      try {
        await userSessionsRealtime.update(payload);
        LOG('Connected');
      } catch (err) {
        ERROR('tried update the session collection:', err);
      }
    } else {
      LOG('will manually mask as disconnected');

      // Disconnect locally
      try {
        if (userSessionsRealtime) {
          await userSessionsRealtime.update(destroySessionPayload(payload));
        } else {
          LOG('without userSessionsRealtime to disconnect');
        }
      } catch (err) {
        ERROR('tried to update locally', err);
      }

      if (beaconRealtime) {
        try {
          await beaconRealtime.set(false);
        } catch (err) {
          ERROR('tried disconnect locally:', err);
        }
      }
      LOG('manually mask as disconnected');

      if (isConnected) {
        setIsConnected(false);
        // Restaure the listener
        if (presenceRef) {
          presenceRef.off('value', onValue);
          LOG('remove listener to the presence:value');
  
          presenceRef.on('value', onValue);
          LOG('register listener again');
        }
      }
    }
  };

  const onValue = async (snapshot: firebase.database.DataSnapshot) => {
    const value: boolean = snapshot.val();
    LOG('snapshot value:', value);
    sessionHandler(value);
  };

  useEffect(() => {
    LOG('component have been mounted');

    // Get & use presence
    presenceRef = realtimeDB.ref('.info/connected');
    presenceRef.on('value', onValue);

    if (isGlobal && beaconRealtime) {
      beaconRealtime.on('value', async (snapshot) => {
        if (snapshot.val() === false) {
          try {
            await beaconRealtime!.set(true);
            LOG('reset beacon to true from here');
          } catch(err) {
            ERROR('tried set beacon to true:', err);
          }
        }
      });
    }

    (async () => {
      /**
       * Check if the component is in global mode to check if the user is already
       * connected.
       */
      if (isGlobal && beaconRealtime) {
        const data = await beaconRealtime.get();
        const beacon = data.exists() && data.val();

        /**
         * If beacon is true, then the user is connected in another page
         */
        if (beacon) {
          LOG('the user is ALREADY connected globally');
          setIsDeactive(true);
          return;
        } else {
          // First time, then set true the beacon
          await beaconRealtime.set(true);
          LOG('mark globally as connected here');
        }        
      }
    })().catch((err) => ERROR('error in Presence component:', err));

    /**
     * If the component is configured as global, then we don't have to
     * disconnect when the component gets be unmounted.
     */
    if (isGlobal) {
      LOG('component mount as global: OK');
      return;
    }

    LOG('component mount as local: OK');
    
    return () => {
      if (userSessionsRealtime) {
        if (onDisconnect) {
          try {
            onDisconnect.cancel(); // Avoid that
            LOG('cancel disconnection updating');
          } catch (err) {
            ERROR('tried cancel disconnection:', err);
          }
        } else {
          ERROR('cannot disconnect because the onDisconnect is invalid');
        }
        
        try {
          userSessionsRealtime.update(destroySessionPayload(payload));
          LOG('disconnect manually by unmount');
        } catch (err) {
          ERROR('tried update manually session as disconnected:', err);
        }
      }
    };
  }, []);

  return (
    <></>
  );
}

export default Presence;
