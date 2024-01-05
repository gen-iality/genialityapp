import { EventEndpoint, eventEndpoint } from '@/endpoints/events.endpoint';
import { IValidateCapacity } from '@/events-capacity';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance from '@/helpers/request';
import { IResultGet, IResultPut } from '@/types';
import { AxiosInstance } from 'axios';

class EventService {
  constructor(private readonly endpoint: EventEndpoint, private readonly privateClient: AxiosInstance) {}

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
        status,
      };
    }
  }

  async editEvent(eventId: string, putEvent: any): Promise<IResultPut> {
    try {
      let token = await GetTokenUserFirebase();
      const { status, data } = await this.privateClient.put(`api/events/${eventId}?token=${token}`, putEvent);
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

  async validateAttendeeCapacity(eventId: string) {
    let token = await GetTokenUserFirebase();
    const { data } = await this.privateClient.get<IValidateCapacity>(
      `api/events/${eventId}/validate-attendee-capacity?token=${token}`
    );
    return data;
  }
}

export const eventService = new EventService(eventEndpoint, privateInstance);
