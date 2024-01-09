import { eventService } from '@/services';

export const useEventCapacityValidator = () => {
  const getRemainingCapacity = async (eventId: string): Promise<number> => {
    try {
      if (!eventId) return Infinity;
      const remainingCapacity = await eventService.validateAttendeeCapacity(eventId);
      return (
        remainingCapacity.attendeeCapacity.capacity_allowed - remainingCapacity.attendeeCapacity.quantity_attendees
      );
    } catch (error) {
      return 0;
    }
  };

  const isCompletedAforo = async (eventId: string) => {
    try {
      if (!eventId) return false;
      const { attendeeCapacity } = await eventService.validateAttendeeCapacity(eventId);
      return attendeeCapacity.is_completed;
    } catch (error) {
      return false;
    }
  };

  return { getRemainingCapacity, isCompletedAforo };
};
