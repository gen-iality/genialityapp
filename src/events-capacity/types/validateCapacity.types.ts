export interface IValidateCapacity {
  attendeeCapacity: {
    is_completed: boolean;
    capacity_allowed: number;
    quantity_attendees: number;
  };
}
