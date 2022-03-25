export const useRequest = {
  Events: {
    getOldEvents: (pageSize: number) => `/api/eventsbeforetoday?pageSize=${pageSize}`,
    getNextEvents: (pageSize: number) => `/api/eventsaftertoday?pageSize=${pageSize}`,
  },
};
