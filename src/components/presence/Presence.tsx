/* eslint no-console: error */
import firebase from 'firebase/compat/app';

import { useEffect, useState } from 'react';

import { createInitialSessionPayload, convertSessionPayloadToOffline } from './utils';
import type { UserSessionId } from './types';

export interface PresenceProps {
  userId: string;
  organizationId: string;
  // Firebase stuffs
  database: firebase.database.Database,
  firestore: firebase.firestore.Firestore,
  // Loggers
  debuglog: (...args: any[]) => void;
  errorlog: (...args: any[]) => void;
  /**
   * This prop enable us to configure as a global presence manager, and avoid
   * disconnect the session when the component gets be unmounted.
   * 
   * NOTE: The component in global mode should be rendered only once.
   */
  global?: boolean;
};

function Presence(props: PresenceProps) {
  /* eslint-disable no-console */
  const {
    debuglog = console.debug,
    errorlog = console.error,
  } = props;
  /* eslint-enable no-console */

  const {
    database,
    firestore,
    global: isGlobal,
  } = props;

  const [payload, setPayload] = useState(createInitialSessionPayload(props.userId, props.organizationId));

  useEffect(() => {
    if (!props.userId) return;
    if (!props.organizationId) return;

    const userSessionsIdDB = firestore.collection('user_sessions').doc(props.userId);

    let userSessionsRealtime: firebase.database.Reference;
    let onDisconnect: firebase.database.OnDisconnect;
    let lastId = 0;

    (async () => {
      const result = await userSessionsIdDB.get();
      // Get last ID
      if (result.exists) {
        const document = result.data() as UserSessionId;
        if (typeof document.lastId === 'number') {
          lastId = document.lastId;
          debuglog('update lastId to', lastId);
        }
      }

      // Update last ID
      await userSessionsIdDB.set({ lastId: lastId + 1 });
      debuglog('mask as connected');

      // Get the path in realtime
      userSessionsRealtime = database.ref(`/user_sessions/${props.userId}/${lastId}`);

      // Get presence
      const presence = database.ref('.info/connected');

      // Use presence
      presence.on('value', async (snapshot) => {
        if (snapshot.val() === false) {
          // Disconnect locally
          await userSessionsRealtime.update(convertSessionPayloadToOffline(payload));
          debuglog('manually mask as disconnected');
          return;
        }

        // Get this object to save a value when the FB gets be disconnected
        onDisconnect = userSessionsRealtime.onDisconnect();
        // Save the disconnection value
        await onDisconnect.update(convertSessionPayloadToOffline(payload));
        // Mask as connected
        await userSessionsRealtime.set(payload);
        // myDbRef.set({ ...fakePayload, status: 'on', size: 'P' });
        debuglog('Connected');
      });
    })();

    debuglog('OK');

    /**
     * If the component is configured as global, then we don't have to
     * disconnect when the component gets be unmounted.
     */
    if (!isGlobal) {
      return () => {
        if (userSessionsRealtime) {
          if (onDisconnect) {
            onDisconnect.cancel(); // Avoid that
            debuglog('cancel disconnection updating');
          } else {
            errorlog('cannot disconnect');
          }
          
          userSessionsRealtime.update(convertSessionPayloadToOffline(payload));
          debuglog('disconnect manually by unmount');
        }
      };
    }
  }, []);

  return (
    <></>
  );
}

export default Presence;
