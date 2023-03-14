import { IParticipants } from "./meetings.interfaces";

export interface TransferType {
    key: string;
    title: string;
    description: string;
}

export interface PropsMeetingForm {
    cancel: () => void;
}

export const UsuariosArray:TransferType[]=[
    {
        key:'1',
        title:"Carlos",
        description:"Descripcion 1"
    },
    {
        key:'2',
        title:"Luis",
        description:"Descripcion 2"
    },
    {
        key:'3',
        title:"Marlon",
        description:"Descripcion 3"
    }
]


