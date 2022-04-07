export const useRequest = {
  Events: {
    getOldEvents: (pageSize: number) => `/api/eventsbeforetoday?pageSize=${pageSize}`,
    getNextEvents: (pageSize: number) => `/api/eventsaftertoday?pageSize=${pageSize}`,
  },
  EventUsers: {
    getEventUserByCedula: (cedula: string, eventId: string) =>
      `/api/events/${eventId}/eventusers?filtered=[{"field":"properties.cedula","value":"${cedula}"}]`,
  },
};
