import { OrganizationApi } from '@/helpers/request';
import { useCallback, useEffect, useState } from 'react';

const useGetMyOrganizationUser = (organizationId: string) => {
  const [myOrgUser, setMyOrgUser] = useState<any | null>(null);
  const [isLoadingMyOrgUser, setIsLoadingMyOrgUser] = useState(true);

  const getMyOrgUser = useCallback(async () => {
    try {
      const { data } = await OrganizationApi.getMeUser(organizationId);
      return data[0];
    } catch (error) {
      throw error;
    }
  }, [organizationId]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingMyOrgUser(true);
      const myOrgUser = await getMyOrgUser();
      setMyOrgUser(myOrgUser);
      setIsLoadingMyOrgUser(false);
    } catch (error) {
      setMyOrgUser(null);
      setIsLoadingMyOrgUser(false);
    }
  }, [getMyOrgUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { myOrgUser, isLoadingMyOrgUser, fetchData };
};

export default useGetMyOrganizationUser;
