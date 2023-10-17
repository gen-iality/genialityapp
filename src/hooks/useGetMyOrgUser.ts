import { useEffect, useState } from 'react';
import { OrganizationApi } from '@/helpers/request';

export const useGetMyOrgUser = (organizationId: string) => {
  const [myUserOrg, setMyUserOrg] = useState<any>();
  const [isLoadingMyUserOrg, setisLoadingMyUserOrg] = useState(true);
  useEffect(() => {
    const getMyUserOrg = async () => {
      try {
        setisLoadingMyUserOrg(true);
        const { data } = await OrganizationApi.getMeUser(organizationId);
        if (Array.isArray(data)) {
          setMyUserOrg(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setisLoadingMyUserOrg(false);
      }
    };
    getMyUserOrg();
  }, [organizationId]);

  return { myUserOrg, isLoadingMyUserOrg };
};
