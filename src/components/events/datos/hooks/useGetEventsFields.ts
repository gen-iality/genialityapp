import { EventFieldsApi } from '@/helpers/request';
import { useEffect, useState } from 'react';
import { Field } from '../types';

interface IOptions {
  eventId: string;
}
export const useGetEventsFields = ({ eventId }: IOptions) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoadingEventsFields, setIsLoadingEventsFields] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoadingEventsFields(true);
        const data = await EventFieldsApi.getAll(eventId);
        if (isMounted) setFields(data);
      } catch (error) {
        setError(null);
      } finally {
        setIsLoadingEventsFields(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  return { fields, isLoadingEventsFields, error };
};
