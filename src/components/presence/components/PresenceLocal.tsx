/* eslint no-console: error */
import { fireRealtime, firestore, ServerValue, FieldValue, app } from '@helpers/firebase';
import { useEffect, useState } from 'react';

import { sessionStatus } from '../constants';
import { createInitialSessionPayload, convertSessionPayloadToOffline } from '../utils';
import type { SessionPayload, UserSessionId } from '../types';

export interface PresenceLocalProps {
  userId: string;
  organizationId: string;
  debuglog: (...args: any[]) => void,
  errorlog: (...args: any[]) => void,
};

function PresenceLocal(props: PresenceLocalProps) {
  /* eslint-disable no-console */
  const {
    debuglog = console.debug,
    errorlog = console.error,
  } = props;
  /* eslint-enable no-console */

  const [payload, setPayload] = useState(createInitialSessionPayload(props.userId, props.organizationId));

  useEffect(() => {
    if (!props.userId) return;
    if (!props.organizationId) return;

    const userSessionsIdDB = firestore.collection('user_sessions').doc(props.userId);

    let userSessionsRealtime: app.database.Reference;
    let onDisconnect: app.database.OnDisconnect;
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
      userSessionsRealtime = fireRealtime.ref(`/user_sessions/${props.userId}/${lastId}`);

      // Get presence
      const presence = fireRealtime.ref('.info/connected');

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
  }, []);

  return (
    <></>
  );
}

export default PresenceLocal;