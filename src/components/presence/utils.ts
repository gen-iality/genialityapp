import { fireRealtime, firestore, ServerValue, FieldValue, app } from '@helpers/firebase';
import type { SessionPayload, UserSessionId } from './types';
import { sessionStatus } from '../constants';

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
