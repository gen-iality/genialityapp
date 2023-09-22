/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useState, useEffect } from 'react';
import { convertUTC } from '@/hooks/useConvertUTC';
import { OrganizationApi } from '@/helpers/request';

export function useGetEventsStatisticsData(organizationId) {
  const [membersDat, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [membersAll, setMembersAll] = useState(true);

  async function fetchEventsStatisticsData() {
    const { data } = await OrganizationApi.getUsers(organizationId);
    const fieldsMembersData = [];
    data.map((membersData, index) => {
      const properties = {
        ...membersData.properties,
        _id: membersData._id,
        created_at: convertUTC(new Date(membersData.created_at)).newDateWithMoment,
        updated_at: convertUTC(new Date(membersData.updated_at)).newDateWithMoment,
        position: membersData.rol?.name ?? 'NaN', //Si no viene Rol validar que deba traerlo
        rol_id: membersData.rol_id,
        isAuthor: membersData.account_id === membersData.organization.author,
      };
      fieldsMembersData.push(properties);
    });
    setMembersData(fieldsMembersData);
    setMembersAll(data)
    setIsLoading(false);
  }

  useEffect(() => {
    fetchEventsStatisticsData();
  }, [organizationId]);

  return {membersAll, membersDat, isLoading, fetchEventsStatisticsData };
}
