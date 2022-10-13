/* eslint no-console: error */
import firebase from 'firebase/compat/app';

import { useEffect, useState } from 'react';

import { createSessionPayload, destroySessionPayload } from './utils';
import type { UserSessionId } from './types';

export interface PresenceProps {
  userId: string;
  organizationId: string;
  // Firebase stuffs
  realtimeDB: firebase.database.Database,
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
    global: isGlobal,
  } = props;

  const [payload, setPayload] = useState(createSessionPayload(props.userId, props.organizationId));

  useEffect(() => {
    if (!props.userId) return;
    if (!props.organizationId) return;

    let userSessionsRealtime: firebase.database.Reference;
    let onDisconnect: firebase.database.OnDisconnect;

    (async () => {
      LOG('mask as connected');

      // Get the path in realtime
      if (isGlobal) {
        userSessionsRealtime = realtimeDB.ref(`/user_sessions/global`).child(`${props.userId}`).push();
      } else {
        userSessionsRealtime = realtimeDB.ref(`/user_sessions/local`).child(`${props.userId}`).push();
      }

      // Get presence
      const presence = realtimeDB.ref('.info/connected');

      // Use presence
      presence.on('value', async (snapshot) => {
        if (snapshot.val() === false) {
          // Disconnect locally
          await userSessionsRealtime.update(destroySessionPayload(payload));
          LOG('manually mask as disconnected');
          return;
        }

        // Get this object to save a value when the FB gets be disconnected
        onDisconnect = userSessionsRealtime.onDisconnect();
        // Save the disconnection value
        await onDisconnect.update(destroySessionPayload(payload));
        // Mask as connected
        await userSessionsRealtime.set(payload);
        LOG('Connected');
      });
    })();

    LOG('OK');

    /**
     * If the component is configured as global, then we don't have to
     * disconnect when the component gets be unmounted.
     */
    if (isGlobal) return;
    
    return () => {
      if (userSessionsRealtime) {
        if (onDisconnect) {
          onDisconnect.cancel(); // Avoid that
          LOG('cancel disconnection updating');
        } else {
          ERROR('cannot disconnect because the onDisconnect is invalid');
        }
        
        userSessionsRealtime.update(destroySessionPayload(payload));
        LOG('disconnect manually by unmount');
      }
    };
  }, []);

  return (
    <></>
  );
}

export default Presence;
