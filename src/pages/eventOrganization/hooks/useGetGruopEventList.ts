/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { GroupEvent, GroupEventMongo } from '../interface/group.interfaces';
import { GroupsApi } from '@/helpers/request';

export const useGetGruopEventList = (organizationId: string) => {
  const [groupEvent, setGroupEvent] = useState<GroupEventMongo[]>([]);
  const [isLoadingGroup, setIsLoading] = useState(true);

  const getGroups = async () => {
    try {
      const response: GroupEventMongo[] = await GroupsApi.getGroupsByOrg(organizationId);
      setGroupEvent(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('No se ha podido traer la informacion', error);
    }
  };

  const handledDelete = async (groupId: string) => {
    try {
      await GroupsApi.deleteOne(organizationId, groupId);
      setGroupEvent((currentGroups) => {
        const newGroups = currentGroups.filter((group) => group.item._id !== groupId);
        return newGroups;
      });
    } catch (error) {
      throw new Error();
    }
  };

  const handledUpdateGroup = async (groupId: string, newGroupData: GroupEvent) => {
    try {
      await GroupsApi.update(organizationId, groupId, newGroupData);
      setGroupEvent((currentGroups) =>
        currentGroups.map((group) => {
          if (group.item._id === groupId) {
            return { ...group, item: { ...group.item, name: newGroupData.name }, label: newGroupData.name };
          }
          return group;
        })
      );
    } catch (error) {
      throw new Error();
    }
  };

  const handledAddGroup = async (newGrupo: GroupEvent) => {
    try {
      await GroupsApi.create(organizationId, newGrupo);
      getGroups();
    } catch (error) {
      throw new Error();
    }
  };

  useEffect(() => {
    getGroups();
  }, [organizationId]);
  return { isLoadingGroup, groupEvent, handledDelete, handledUpdateGroup, handledAddGroup, getGroups };
};
