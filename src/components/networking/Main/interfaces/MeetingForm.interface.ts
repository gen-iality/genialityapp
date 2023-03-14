import { IMeeting, IParticipants } from "./meetings.interfaces";

export interface TransferType {
    key: string;
    title: string;
}

export interface FormMeeting {
    id?:string;
    name?:string;
    participants?:IParticipants[];
    date?:string | Date;
    time?:string
    place?:string
} 

export interface PropsMeetingForm {
    cancel: () => void;
    reunion_info?:IMeeting
    attendees:any[]
    edit:boolean
}

export const UsuariosArray:TransferType[]=[
    {
        key:'1',
        title:"Carlos",
    },
    {
        key:'2',
        title:"Luis",
    },
    {
        key:'3',
        title:"Marlon",
    }
]


