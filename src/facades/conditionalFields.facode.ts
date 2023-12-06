import { IConditionalField } from '@/components/events/datos/types/conditional-form.types';
import { ConditionalFieldsEndpoint, conditionalFieldsEndpoint } from '@/endpoints/conditional-fields.endpoints';
import { IResultDelete } from '@/types';

class ConditionalFieldsFacade {
  constructor(private readonly endpoint: ConditionalFieldsEndpoint) {}

  async getAll() {
    return this.endpoint.getAll();
  }

  async getById(id: string) {
    return this.endpoint.getById(id);
  }

  async create(eventId: string, conditionalField: IConditionalField) {
    return await this.endpoint.create(eventId, conditionalField);
  }

  async update(eventId: string, fieldId: string, conditionalField: IConditionalField) {
    return this.endpoint.update(eventId, fieldId, conditionalField);
  }

  async delete(eventId: string, fieldId: string): Promise<IResultDelete> {
    try {
      const { data, status } = await this.endpoint.delete(eventId, fieldId);
      return {
        error: null,
        data,
        status,
      };
    } catch (error) {
      return {
        error,
        status: error?.response?.status as number,
      };
    }
  }
}

export const conditionalFieldsFacade = new ConditionalFieldsFacade(conditionalFieldsEndpoint);
