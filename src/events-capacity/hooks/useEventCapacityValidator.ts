import { eventService } from '@/services';

export const useEventCapacityValidator = () => {
  const getRemainingCapacity = async (eventId: string) => {
    try {
      if (!eventId) return;
      const remainingCapacity = await eventService.validateAttendeeCapacity(eventId);
      return remainingCapacity.capacity - remainingCapacity.attendees;
    } catch (error) {
      return 0;
    }
  };

  return { getRemainingCapacity };
};
