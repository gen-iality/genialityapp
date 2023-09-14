/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { GroupEvent } from '../interface/group.interfaces';
import { GroupsApi } from '@/helpers/request';


export const useGetGruopEventList = (organizationId: string) => {
  const [groupEvent, setGroupEvent] = useState<GroupEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await GroupsApi.getAll(organizationId);
      console.log('response',response)
      setGroupEvent(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('No se ha podido traer la informacion', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [organizationId]);
  //@ts-ignore
  const createGroup = async (organizationId: string, data: any) => {
    try {
      await GroupsApi.create(organizationId, data);
    } catch (error) {
      console.error('No se ha podido traer la informacion', error);
    }
  };
  const updateGroup = async (organizationId: string, groupId: string, data: any) => {
    try {
      await GroupsApi.update(organizationId, groupId, data);
    } catch (error) {
      console.error('No se ha podido traer la informacion', error);
      
    }
  };

  const deleteGroup = async (organizationId: string, groupId: string) => {
    try {
      await GroupsApi.deleteOne(organizationId, groupId);
    } catch (error) {
      console.error('No se ha podido traer la informacion', error);
    }
  };

  return { isLoading, groupEvent, createGroup, updateGroup, deleteGroup };
};
