export const GetAllEvents = (): Promise<Event[]> => {
  return new Promise((resolve, reject) => {
    Event.find({}, (err: any, events: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(events);
      }
    });
  });
};
