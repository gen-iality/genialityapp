export type PossibleSessionStatus = 'online' | 'offline';

export type SessionStatusName = 'ONLINE' | 'OFFLINE';

export type SessionStatus = {
  [key in SessionStatusName]: PossibleSessionStatus;
};

export type SessionPayload = {
  userId: string;
  organizationId: string;
  startTimestamp?: any;
  endTimestamp?: any;
  status: PossibleSessionStatus;
};

export type UserSessionId = {
  lastId: string;
};
