export const GetAllEvents = (): Promise<Event[]> => {
  return new Promise((resolve, reject) => {
    Event.find({}, (err, events) => {
      if (err) {
        reject(err);
      } else {
        resolve(events);
      }
    });
  });
};
