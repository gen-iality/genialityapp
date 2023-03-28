import { Moment } from "moment";
import { ITypeMeenting } from './configurations.interfaces';

export interface IMeetingList {
    meentings : IMeeting[]
}

export interface IMeentingItem {
    meenting : IMeeting
}
export interface IMeeting {
    id :string;
    name  : string;
    start  : string
    end    : string;
    place : string;
    type : ITypeMeenting | undefined
    dateUpdated : number
    participants : IParticipants[];
}


export interface IParticipants {
    id:string
    name   : string
    email? : string
    attendance  : typeAttendace
}

export enum typeAttendace {
    confirmed = 'asistencia confirmada',
    unconfirmed = 'sin confirmar'
}
export interface TransferType extends IParticipants{
    key: string;
}

export interface FormMeeting {
    id?:string;
    name:string;
    participants:IParticipants[];
    date:Moment[];
    place:string;
    type: string | undefined
}

export interface IEventCalendar<T> {
    start: Date;
    end:   Date;
    event: T ;
    resourceId?: number;
    isAllDay?: boolean;
}

export interface IMeetingCalendar extends IMeeting {
    assigned : string
}
