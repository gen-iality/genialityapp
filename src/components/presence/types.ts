export type PossibleSessionStatus = 'online' | 'offline';

export type SessionStatusName = 'ONLINE' | 'OFFLINE';

export type SessionStatus = {
  [key in SessionStatusName]: PossibleSessionStatus;
};

export type SessionPayload<T = any> = {
  startTimestamp?: any;
  endTimestamp?: any;
  status: PossibleSessionStatus;
  data?: T,
};
