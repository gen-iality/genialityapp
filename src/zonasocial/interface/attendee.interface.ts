import { User } from '@/components/assembly/types';
import { Timestamp } from 'firebase/firestore';

export interface IAttendee {
  state_id: string;
  checked_in: boolean;
  printouts_at: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  private_reference_number: string;
  printouts: number;
  rol: Rol;
  user: User;
  checkedin_at: Timestamp;
  printouts_history: any[];
  _id: string;
  rol_id: string;
  activityProperties: ActivityProperty[];
  checkedin_type: string;
  account_id: string;
  properties: Properties;
  event_id: string;
}

export interface IAttendeeParsed {
  uid: string;
  iduser: string;
  name: string;
  names: string;
  email: string;
  properties: Properties;
  imageProfile: string;
}
export interface ActivityProperty {
  checked_in: boolean;
  checkedin_type: string;
  activity_id: string;
  checkedin_at: string;
}

export interface Properties {
  names: string;
  email: string;
  [key: string]: any;
}

export interface Rol {
  name: string;
  updated_at: string;
  created_at: string;
  type: string;
  _id: string;
  module: string;
  guard_name: string;
}
