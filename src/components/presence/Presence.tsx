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

  let userSessionsRealtime: firebase.database.Reference;
  let userSessionsRealtimeBlocker: firebase.database.Reference | undefined;
  let onDisconnect: firebase.database.OnDisconnect;

  const sessionHandler = async (isConnected: boolean) => {
    if (isConnected) {
      LOG('it is online');
      // If it is global mode and the blocker is define, we have to set
      // in false when globally gets disconnected
      if (userSessionsRealtimeBlocker) {
        try {
          await userSessionsRealtimeBlocker.onDisconnect().set(false);
        } catch (err) {
          ERROR('tried set a value in disconnection for userSessionsRealtimeBlocker:', err);
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
        await userSessionsRealtime.set(payload);
        LOG('Connected');
      } catch (err) {
        ERROR('tried update the session collection:', err);
      }
    } else {
      LOG('will manually mask as disconnected');

      // Disconnect locally
      try {
        await userSessionsRealtime.update(destroySessionPayload(payload));
      } catch (err) {
        ERROR('tred to update locally', err);
      }

      if (userSessionsRealtimeBlocker) {
        try {
          await userSessionsRealtimeBlocker.set(false);
        } catch (err) {
          ERROR('tried disconnect locally:', err);
        }
      }
      LOG('manually mask as disconnected');
    }
  };

  useEffect(() => {
    if (!props.userId) return;
    if (!props.organizationId) return;

    // Get the path in realtime
    if (isGlobal) {
      userSessionsRealtime = realtimeDB.ref(`/user_sessions/global`).child(`${props.userId}`).push();
      userSessionsRealtimeBlocker = realtimeDB.ref(`/user_sessions/beacon`).child(`${props.userId}`);
    } else {
      userSessionsRealtime = realtimeDB.ref(`/user_sessions/local`).child(`${props.userId}`).push();
    }

    (async () => {
      LOG('component will be mount');
      /**
       * Check if the component is in global mode to check if the user is already
       * connected.
       */
      if (isGlobal && userSessionsRealtimeBlocker) {
        const data = await userSessionsRealtimeBlocker.get();
        const beacon = data.exists() && data.val();

        /**
         * If beacon is true, then the user is connected in another page
         */
        if (beacon) {
          LOG('the user is ALREADY connected globally');
          return;
        } else {
          await userSessionsRealtimeBlocker.set(true);
          LOG('mark globally as connected');
        }        
      }

      // Get presence
      const presence = realtimeDB.ref('.info/connected');

      // Use presence
      presence.on('value', async (snapshot) => {
        const value: boolean = snapshot.val();
        LOG('snapshot', value);
        sessionHandler(value);
      });
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
