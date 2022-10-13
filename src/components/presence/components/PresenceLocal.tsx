import { fireRealtime, firestore, ServerValue, FieldValue, app } from '@helpers/firebase';
import { useEffect, useState } from 'react';

import Logger from '@Utilities/logger';
import { sessionStatus } from '../constants';
import type { SessionPayload, UserSessionId } from '../types';

const { LOG } = Logger('presence');

export interface PresenceLocalProps {
  userId: string;
  organizationId: string;
};

export function createInitialSessionPayload(userId: string, organizationId: string) {
  const payload: SessionPayload = {
    userId,
    organizationId,
    startTimestamp: ServerValue.TIMESTAMP,
    status: sessionStatus.ONLINE,
  };

  return payload;
}

/**
 * Given an session payload, this function modifies it to convert to a session
 * payload that says offline.
 * 
 * @param payload The sesion payload.
 * @returns A modified session payload.
 */
export function convertSessionPayloadToOffline(payload: SessionPayload): SessionPayload {
  const newPayload = { ...payload };
  delete newPayload.startTimestamp;
  newPayload.status = sessionStatus.OFFLINE;
  newPayload.endTimestamp = ServerValue.TIMESTAMP;
  return newPayload;
};

function PresenceLocal(props: PresenceLocalProps) {
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
          LOG('update lastId to', lastId);
        }
      }

      // Update last ID
      await userSessionsIdDB.set({ lastId: lastId + 1 });
      LOG('mask as connected');

      // Get the path in realtime
      userSessionsRealtime = fireRealtime.ref(`/user_sessions/${props.userId}/${lastId}`);

      // Get presence
      const presence = fireRealtime.ref('.info/connected');

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

    console.log('OK');

    return () => {
      if (userSessionsRealtime) {
        if (onDisconnect) {
          onDisconnect.cancel(); // Avoid that
          LOG('cancel disconnection updating');
        } else {
          LOG('cannot disconnect');
        }
        
        userSessionsRealtime.update(convertSessionPayloadToOffline(payload));
        LOG('disconnect manually by unmount');
      }
    };
  }, []);

  return (
    <></>
  );
}

export default PresenceLocal;