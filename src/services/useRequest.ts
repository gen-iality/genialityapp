// getOldEvents: async (query) => {
//     return await Actions.getAll(`/api/eventsbeforetoday${query}`, true);
//   },
//   getNextEvents: async (query) => {
//     return await Actions.getAll(`/api/eventsaftertoday${query}`, true);
//   },

export const useRequest = {
  Events: {
    getOldEvents: (pageSize: number) => `/api/eventsbeforetoday?pageSize=${pageSize}`,
  },
};
