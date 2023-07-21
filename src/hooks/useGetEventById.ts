import { useEffect, useState } from 'react';
import { EventsApi } from '@/helpers/request';

export const useGetEventById = (eventId: string) => {
  const [event, setEvent] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const getEventById = async () => {
    const event = await EventsApi.getOne(eventId);
    setEvent(event);
  };
  useEffect(() => {
    getEventById();
  }, [eventId]);

  return {
    event,
    isLoading
  };
};
