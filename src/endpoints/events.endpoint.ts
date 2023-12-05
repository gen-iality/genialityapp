import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance, { publicInstance } from '@/helpers/request';
import { AxiosInstance } from 'axios';

export class EventEndpoint {
  constructor(private readonly privateClient: AxiosInstance, private readonly publicClient: AxiosInstance) {}

  async getById(id: string) {
    let token = await GetTokenUserFirebase();
    if (token) {
      return await this.privateClient.get(`/api/events/${id}?token=${token}`);
    }
    return await this.privateClient.get(`/api/events/${id}`);
  }
}

export const eventEndpoint = new EventEndpoint(privateInstance, publicInstance);
