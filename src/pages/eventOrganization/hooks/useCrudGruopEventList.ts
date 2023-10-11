/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { GroupEvent, GroupEventMongo } from '../interface/group.interfaces';
import { GroupsApi } from '@/helpers/request';

interface IOptions {
  requestGet: boolean;
}
const initialOptions: IOptions = {
  requestGet: true,
};

export const useCrudGruopEventList = (organizationId: string, options?: Partial<IOptions>) => {
  const { requestGet } = { ...initialOptions, ...options };

  const [groupEvent, setGroupEvent] = useState<GroupEventMongo[]>([]);
  const [isLoadingGroup, setIsLoading] = useState(requestGet);

  const getGroups = async () => {
    try {
      setIsLoading(true);
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
            return {
              ...group,
              item: {
                ...group.item,
                ...newGroupData,
              },
              label: newGroupData.name,
            };
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

  const handledDelteEvent = async (orgId: string, groupId: string, eventId: string) => {
    await GroupsApi.deleteEventFromGroup(orgId, groupId, eventId);
    const newGroupList: GroupEventMongo[] = groupEvent.map((group) => ({
      ...group,
      item: {
        ...group.item,
        event_ids: group.item.event_ids.filter((eventIdItem) => eventIdItem === eventId),
      },
    }));
    setGroupEvent(newGroupList);
  };
  const handledDelteOrgUser = async (orgId: string, groupId: string, orgUserId: string) => {
    await GroupsApi.deleteOrgUserFromGroup(orgId, groupId, orgUserId);
    const newGroupList: GroupEventMongo[] = groupEvent.map((group) => ({
      ...group,
      item: {
        ...group.item,
        organization_user_ids: group.item.organization_user_ids.filter((orgUserIdItem) => {
          return orgUserIdItem !== orgUserId;
        }),
      },
    }));
    setGroupEvent(newGroupList);
  };

  useEffect(() => {
    if (requestGet) getGroups();
  }, [organizationId]);

  return {
    isLoadingGroup,
    groupEvent,
    handledDelete,
    handledUpdateGroup,
    handledAddGroup,
    getGroups,
    handledDelteEvent,
    handledDelteOrgUser,
  };
};
