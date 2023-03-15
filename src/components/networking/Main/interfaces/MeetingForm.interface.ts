import { IMeeting, IParticipants } from "./meetings.interfaces";

export interface TransferType extends IParticipants{
    key: string;
}

export interface FormMeeting {
    id?:string;
    name:string;
    participants:IParticipants[];
    date:string | Date;
    place:string
} 


