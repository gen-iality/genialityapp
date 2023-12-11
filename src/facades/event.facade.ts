import { EventEndpoint, eventEndpoint } from '@/endpoints/events.endpoint';

class EventFacade {
  constructor(private readonly endpoint: EventEndpoint) {}

  async getById(eventId: string) {
    return this.endpoint.getById(eventId);
  }
}

export const eventFacade = new EventFacade(eventEndpoint);
