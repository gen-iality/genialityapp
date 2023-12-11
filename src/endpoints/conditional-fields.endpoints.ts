import { IConditionalField } from '@/components/events/datos/types/conditional-form.types';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance from '@/helpers/request';
import { AxiosInstance } from 'axios';

export class ConditionalFieldsEndpoint {
  constructor(private readonly client: AxiosInstance) {}

  async getAll() {
    return await this.client.get('/cars');
  }

  async getById(id: string) {
    return await this.client.get(`/cars/${id}`);
  }

  async create(eventId: string, conditionalField: IConditionalField) {
    let token = await GetTokenUserFirebase();
    return await this.client.post(`/api/events/${eventId}/fields-conditions?token=${token}`, conditionalField);
  }

  async update(eventId: string, fieldId: string, conditionalField: IConditionalField) {
    return await this.client.put(`/api/events/${eventId}/fields-conditions/${fieldId}`, conditionalField);
  }

  async delete(eventId: string, fieldId: string) {
    return await this.client.delete(`/api/events/${eventId}/fields-conditions/${fieldId}`);
  }
}

export const conditionalFieldsEndpoint = new ConditionalFieldsEndpoint(privateInstance);
