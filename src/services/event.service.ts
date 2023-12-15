import { EventEndpoint, eventEndpoint } from '@/endpoints/events.endpoint';
import { IResultGet } from '@/types';

class EventService {
  constructor(private readonly endpoint: EventEndpoint) {}

  async getById(eventId: string): Promise<IResultGet<any>> {
    try {
      const { data, status } = await this.endpoint.getById(eventId);
      return {
        data,
        error: null,
        status,
      };
    } catch (error) {
      const { status } = error.response;
      return {
        error,
        data: null,
        status
      };
    }
  }
}

export const eventService = new EventService(eventEndpoint);
