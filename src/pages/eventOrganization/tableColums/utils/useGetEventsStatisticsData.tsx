import { useState, useEffect } from 'react';
import { convertUTC } from '@/hooks/useConvertUTC';
import { useGetOrganizationUsers } from '../../hooks/useGetOrganizationUsers';
export const useGetEventsStatisticsData = (organizationId: string) => {
  const { getDataOrgUser, isLoadingOrgUsers, organizationUsers, pagination } = useGetOrganizationUsers(organizationId);
  const [lastUpdate, setLastUpdate] = useState<Date>();
  const [membersParsed, setMembersParsed] = useState<any[]>([]);
  const [isLoadingMembersParsed, setIsLoadingMembersParsed] = useState(true);
  useEffect(() => {
    if (!isLoadingOrgUsers) {
      const fieldsMembersData = organizationUsers.map((membersData) => ({
        ...membersData.properties,
        _id: membersData._id,
        created_at: convertUTC(new Date(membersData.created_at))?.newDateWithMoment,
        updated_at: convertUTC(new Date(membersData.updated_at))?.newDateWithMoment,
        position: membersData.rol?.name ?? 'NaN', //Si no viene Rol validar que deba traerlo
        rol_id: membersData.rol_id,
        isAuthor: membersData.account_id === membersData.organization.author,
      }));
      setMembersParsed(fieldsMembersData);
      setIsLoadingMembersParsed(false);
      setLastUpdate(new Date());
    }
  }, [organizationUsers, isLoadingOrgUsers]);

  return { membersParsed, isLoadingMembersParsed, pagination, getDataOrgUser, lastUpdate };
};
