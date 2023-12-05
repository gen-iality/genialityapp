import { IConditionalField } from '@/components/events/datos/types/conditional-form.types';
import { ConditionalFieldsEndpoint, conditionalFieldsEndpoint } from '@/endpoints/conditional-fields.endpoints';
import { IResultPost } from '@/types';

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

  async delete(eventId: string, fieldId: string) {
    return this.endpoint.delete(eventId, fieldId);
  }
}

export const conditionalFieldsFacade = new ConditionalFieldsFacade(conditionalFieldsEndpoint);
