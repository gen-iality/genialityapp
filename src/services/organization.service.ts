import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance from '@/helpers/request';
import { IResultPut } from '@/types';
import { AxiosInstance } from 'axios';

class OrganizationService {
  constructor(private readonly privateClient: AxiosInstance) {}

  async editOrganization(organizationId: string, putOrganization: any): Promise<IResultPut> {
    try {
      let token = await GetTokenUserFirebase();
      const { status, data } = await this.privateClient.put(
        `/api/organizations/${organizationId}?update_events_itemsMenu=false&token=${token}`,
        putOrganization
      );
      return {
        error: null,
        status,
        data,
      };
    } catch (error) {
      const { status } = error.response;
      return {
        error,
        status,
      };
    }
  }
}

export const organizationService = new OrganizationService(privateInstance);
