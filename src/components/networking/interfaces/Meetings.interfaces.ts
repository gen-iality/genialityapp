import { Moment } from "moment";

export interface IMeetingList {
    meentings : IMeeting[]
}

export interface IMeentingItem {
    menting : IMeeting
}
export interface IMeeting {
    id:string;
    name  : string;
    date  : string  | Date;
    horas:string[];
    place : string;
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
    date:string | Date;
    place:string;
    horas:Moment[];
}

