import { useEffect, useState } from 'react';
export const useFilterFreeEventInMyEvents = (
  eventsFreeAcces: any[],
  eventsWithEventUser: any[],
  myUserOrg: any,
  condition: boolean
) => {
  const [eventsFree, setEventFreeFiltered] = useState<any[]>([]);
  const [isFiltering, setisFiltering] = useState(true);

  useEffect(() => {
    setisFiltering(true);
    const eventsFreeFilter = eventsFreeAcces.filter(
      (eventFree) => !eventsWithEventUser.map((eventOfUser) => eventOfUser._id).includes(eventFree._id)
    );
    if (myUserOrg) setEventFreeFiltered(eventsFreeFilter ?? []);
    setisFiltering(false);
  }, [eventsFreeAcces.length, eventsWithEventUser.length, myUserOrg]);

  return {
    eventsFree,
    isFiltering,
  };
};
