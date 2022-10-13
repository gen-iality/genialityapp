/* eslint no-console: error */
import firebase from 'firebase/compat/app';

import { useEffect, useState } from 'react';

import { createInitialSessionPayload, convertSessionPayloadToOffline } from './utils';
import type { UserSessionId } from './types';

export interface PresenceProps {
  userId: string;
  organizationId: string;
  // Firebase stuffs
  realtimeDB: firebase.database.Database,
  firestoreDB: firebase.firestore.Firestore,
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
    debuglog: LOG = console.debug,
    errorlog: ERROR = console.error,
  } = props;
  /* eslint-enable no-console */

  const {
    realtimeDB,
    firestoreDB,
    global: isGlobal,
  } = props;

  const [payload, setPayload] = useState(createInitialSessionPayload(props.userId, props.organizationId));

  useEffect(() => {
    if (!props.userId) return;
    if (!props.organizationId) return;

    const userSessionsIdDB = firestoreDB.collection('user_sessions').doc(props.userId);

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
          LOG('update lastId to', lastId);
        }
      }

      // Update last ID
      await userSessionsIdDB.set({ lastId: lastId + 1 });
      LOG('mask as connected');

      // Get the path in realtime
      if (isGlobal) {
        userSessionsRealtime = realtimeDB.ref(`/user_sessions/${props.userId}/global/${lastId}`);
      } else {
        userSessionsRealtime = realtimeDB.ref(`/user_sessions/${props.userId}/local/${lastId}`);
      }

      // Get presence
      const presence = realtimeDB.ref('.info/connected');

      // Use presence
      presence.on('value', async (snapshot) => {
        if (snapshot.val() === false) {
          // Disconnect locally
          await userSessionsRealtime.update(convertSessionPayloadToOffline(payload));
          LOG('manually mask as disconnected');
          return;
        }

        // Get this object to save a value when the FB gets be disconnected
        onDisconnect = userSessionsRealtime.onDisconnect();
        // Save the disconnection value
        await onDisconnect.update(convertSessionPayloadToOffline(payload));
        // Mask as connected
        await userSessionsRealtime.set(payload);
        // myDbRef.set({ ...fakePayload, status: 'on', size: 'P' });
        LOG('Connected');
      });
    })();

    LOG('OK');

    /**
     * If the component is configured as global, then we don't have to
     * disconnect when the component gets be unmounted.
     */
    if (!isGlobal) {
      return () => {
        if (userSessionsRealtime) {
          if (onDisconnect) {
            onDisconnect.cancel(); // Avoid that
            LOG('cancel disconnection updating');
          } else {
            ERROR('cannot disconnect');
          }
          
          userSessionsRealtime.update(convertSessionPayloadToOffline(payload));
          LOG('disconnect manually by unmount');
        }
      };
    }
  }, []);

  return (
    <></>
  );
}

export default Presence;
