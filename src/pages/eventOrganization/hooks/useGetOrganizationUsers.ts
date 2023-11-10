import { OrganizationApi } from '@/helpers/request';
import { usePaginationListLocal } from '@/hooks/usePaginationListLocal';
import { useCallback, useEffect, useState } from 'react';

export const useGetOrganizationUsers = (organizationId: string) => {
  const [organizationUsers, setOrganizationUsers] = useState<any[]>([]);
  const [isLoadingOrgUsers, setisLoadingOrgUsers] = useState(true);
  const { pagination } = usePaginationListLocal(organizationUsers.length);

  const getOrgUser = useCallback(async () => {
    try {
      const response = await OrganizationApi.getUsers(organizationId);
      return response;
    } catch (error) {
      return { error: true, data: [] };
    }
  }, [organizationId]);

  const getOrgUserAllPages = useCallback(
    async (lastPage: number): Promise<any[]> => {
      try {
        if (lastPage === 1) return [];
        let promiseList = [];
        for (let i = 2; i < lastPage + 1; i++) {
          promiseList.push(OrganizationApi.getUsers(organizationId, i));
        }
        const resOtherOrgUser = await Promise.all(promiseList);
        const otherOrgUser = resOtherOrgUser.reduce((acumulador, objeto) => {
          return acumulador.concat(objeto.data);
        }, []);
        return otherOrgUser;
      } catch (error) {
        return [];
      }
    },
    [organizationId]
  );

  const getDataOrgUser = useCallback(async () => {
    try {
      setisLoadingOrgUsers(true);
      const { data: OrgUsers, meta, error } = await getOrgUser();
      if (error) return;

      const otherOrgUser = await getOrgUserAllPages(meta.last_page);

      const allOrgUser = [...OrgUsers, ...otherOrgUser];

      setOrganizationUsers(allOrgUser);
      setisLoadingOrgUsers(false);
    } catch (error) {
      setisLoadingOrgUsers(false);
    }
  }, [getOrgUser, getOrgUserAllPages]);

  useEffect(() => {
    getDataOrgUser();
  }, [getDataOrgUser]);

  return {
    organizationUsers,
    isLoadingOrgUsers,
    getDataOrgUser,
    pagination,
  };
};
