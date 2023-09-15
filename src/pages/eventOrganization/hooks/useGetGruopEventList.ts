/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { GroupEventMongo } from '../interface/group.interfaces';
import { GroupsApi } from '@/helpers/request';

export const useGetGruopEventList = (organizationId: string) => {
  const [groupEvent, setGroupEvent] = useState<GroupEventMongo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reFetch, setReFetch] = useState(false);

  const fetchData = async () => {
    try {
      const response: GroupEventMongo[] = await GroupsApi.getGroupsByOrg(organizationId);
      setGroupEvent(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('No se ha podido traer la informacion', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [organizationId, reFetch]);

  const updateListGroup = () => {
    setReFetch((current) => !current);
  };

  const handledDelete = (groupId: string) => {
    setGroupEvent((currentGroups) => {
      const newGroups = currentGroups.filter((group) => group.item._id !== groupId);
      return newGroups;
    });
  };

  return { isLoading, groupEvent, updateListGroup, handledDelete };
};
