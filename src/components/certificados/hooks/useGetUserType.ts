import { PropertyTypeUser } from '@/components/agenda/utils/constants';
import { EventsApi } from '@/helpers/request';
import { useCallback, useEffect, useState } from 'react';

export const useGetUserType = (eventId: string) => {
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [isLoadingUserTypes, setIsLoadingUserTypes] = useState(true);
  const getTypes = useCallback(async (): Promise<any[]> => {
    const data = await EventsApi.getOne(eventId);
    const dataTypes = data.user_properties.find((item: any) => item.name === PropertyTypeUser);
    if (dataTypes) {
      return dataTypes.options as any[];
    } else {
      return [];
    }
  }, [eventId]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingUserTypes(true);
      const data = await getTypes();
      setUserTypes(data);
      setIsLoadingUserTypes(false);
    } catch (error) {
      setIsLoadingUserTypes(false);
    }
  }, [getTypes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { userTypes, isLoadingUserTypes };
};
