import { useCallback, useEffect, useState } from 'react';
import {
  ErrorRequest,
  UserOrganizationStatusInEvent,
  UserOrganizationToEvent,
} from '../interface/table-user-oranization-to-event';
import { OrganizationApi } from '@/helpers/request';

export const useGetUsersOrgToEvent = (organizationId: string, eventId: string) => {
  const [membersData, setMembersData] = useState<UserOrganizationToEvent[]>([]);
  const [error, setError] = useState<ErrorRequest>({
    haveError: false,
    messageError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    OrganizationApi.getUsersWithStatusInEvent(organizationId, eventId)
      .then(async ({ data }: { data: UserOrganizationStatusInEvent[] }) => {
        const fieldsMembersData: UserOrganizationToEvent[] = data.map((membersData, index) => {
          return {
            ...membersData.properties,
            id: membersData._id,
            email: membersData.properties.email,
            name: membersData.properties.names,
            isAlreadyEventUser: membersData.existsInEvent,
          };
        });
        setMembersData(fieldsMembersData);
        console.log('fieldsMembersData',fieldsMembersData)
        setIsLoading(false);
        setError({
          haveError: false,
          messageError: '',
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setError({
          haveError: true,
          messageError: 'Error al obtener los usuarios de la organizacion',
        });
      });
  }, [organizationId, eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    membersData,
    error,
    setMembersData,
    setError,
    isLoading,
    fetchData,
  };
};
