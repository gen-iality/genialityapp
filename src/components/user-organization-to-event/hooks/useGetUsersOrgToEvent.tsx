import React, { useEffect, useState } from 'react';
import { ErrorRequest, UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { OrganizationApi } from '@/helpers/request';

export const useGetUsersOrgToEvent = (organizationId: string) => {
  const [membersData, setMembersData] = useState<UserOrganizationToEvent[]>([]);
  const [error, setError] = useState<ErrorRequest>({
    haveError: false,
    messageError: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const isNumberPar = (numero: number) => {
    if (typeof numero !== 'number') return console.log('Debes ingresar un numero');

    if (numero % 2 === 0) {
      return true;
    }

    if (numero % 2 !== 0) {
      return false;
    }
  };
  useEffect(() => {
    if (organizationId) {
      setIsLoading(true);
      OrganizationApi.getUsers(organizationId)
        .then(async ({ data }: { data: any[] }) => {
          const fieldsMembersData: UserOrganizationToEvent[] = [];

          data.forEach(async (membersData, index) => {
            const newField: UserOrganizationToEvent = {
              name: membersData.properties.names,
              id: membersData._id,
              rol: membersData.rol.name,
              email: membersData.user.email,
              isAlreadyEventUser: isNumberPar(index) ? true : false,
            };
            fieldsMembersData.push(newField);
          });
          setMembersData(fieldsMembersData);
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
    }
  }, [organizationId]);

  return {
    membersData,
    error,
    setMembersData,
    setError,
    isLoading,
  };
};
