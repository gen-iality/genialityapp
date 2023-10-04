import { OrganizationApi } from '@/helpers/request';
import { useEffect, useState } from 'react';

export const useGetOrganizationUsers = (organizationId: string) => {
  const [organizationUsers, setOrganizationUsers] = useState<any[]>([]);
  const [isLoadingOrgUsers, setisLoadingOrgUsers] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setisLoadingOrgUsers(true);
        const { data } = await OrganizationApi.getUsers(organizationId);
        if (Array.isArray(data)) setOrganizationUsers(data);
        setisLoadingOrgUsers(false);
      } catch (error) {
        setisLoadingOrgUsers(false);
      }
    };
    getData();
  }, []);

  return {
    organizationUsers,
    isLoadingOrgUsers,
  };
};
