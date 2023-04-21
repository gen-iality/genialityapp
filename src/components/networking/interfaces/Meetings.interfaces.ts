import { Moment } from "moment";
import { ITypeMeenting } from './configurations.interfaces';

export interface IMeetingList {
    meentings: IMeeting[]
    loading: boolean
}

export interface IMeentingItem {
    meenting: IMeeting
}
export interface IMeeting {
    id: string;
    id_request_meetings?: string;
    name: string;
    start: string
    startTimestap: firebase.default.firestore.Timestamp
    end: string;
    place: string;
    type: ITypeMeenting | undefined
    dateUpdated: number
    participants: IParticipants[];
    participantsIds: string[]
}


export interface IParticipants {
    id: string
    name: string
    email?: string
    picture: string
    confirmed: boolean
}

export enum typeAttendace {
    confirmed = 'asistencia confirmada',
    unconfirmed = 'sin confirmar'
}
export interface TransferType extends IParticipants {
    key: string;
}

export interface FormMeeting {
    id?: string;
    name: string;
    participants: IParticipants[];
    date: Moment[];
    place: string;
    type: string | undefined
}

export interface IEventCalendar<T> {
    start: Date;
    end: Date;
    event: T;
    resourceId?: number;
    isAllDay?: boolean;
}

export interface IMeetingCalendar extends Omit<IMeeting, 'start' | 'end'> {
    assigned?: string
    start: Date
    end: Date
}
