import { IOrganization } from '@/components/eventOrganization/types';
import { OrganizationApi } from '@/helpers/request';
import { useCallback, useEffect, useState } from 'react';

const useGetOrganizationData = (organizationId: string) => {
  const [organizationData, setOrganizationData] = useState<IOrganization | null>(null);
  const [isLoadingOrganizationData, setIsLoadingOrganizationData] = useState(true);

  const getOrganizationData = useCallback(async () => {
    try {
      const organizationData = await OrganizationApi.getOne(organizationId);
      return organizationData;
    } catch (error) {
      throw error;
    }
  }, [organizationId]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingOrganizationData(true);
      const organizationData = await getOrganizationData();
      setOrganizationData(organizationData);
      setIsLoadingOrganizationData(false);
    } catch (error) {
      setIsLoadingOrganizationData(false);
      setOrganizationData(null);
    }
  }, [getOrganizationData]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { organizationData, isLoadingOrganizationData, getOrganizationData };
};

export default useGetOrganizationData;
