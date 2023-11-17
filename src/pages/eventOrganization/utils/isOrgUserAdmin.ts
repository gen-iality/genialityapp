import { IOrganization } from '@/components/eventOrganization/types';
import { ROLS_USER } from '@/constants/rols.constants';

export const isOrgUserAdmin = (organization: IOrganization): boolean => {
  return organization.rolInOrganization.name === ROLS_USER.ADMINISTRATOR.NAME;
};
