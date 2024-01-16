import { imageforDefaultProfile } from '@/helpers/constants';
import { IAttendee, IAttendeeParsed } from '..';

export const parseAttendeeListToChat = (attendeeList: IAttendee[]): IAttendeeParsed[] => {
  return attendeeList.map((attendee) => ({
    uid: attendee.user?.uid ?? '',
    iduser: attendee.account_id,
    name: attendee.properties?.name ?? attendee.properties?.names,
    names: attendee.properties?.name ?? attendee.properties?.names,
    email: attendee.properties?.email,
    properties: attendee.properties,
    imageProfile: attendee.user.picture || imageforDefaultProfile,
  }));
};
