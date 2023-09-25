import { Timestamp } from "firebase/firestore";

export interface IMessage {
    id: string;
    profilePicUrl: string;
    name: string;
    sortByDateAndTime: string;
    fecha: Timestamp;
    visible: boolean;
    type: string;
    idparticipant: string;
    text: string;
    timestamp: string;
    iduser: string;
}

export interface IConfigChat {
    message_controlled: boolean;
    message_highlighted?: string | undefined;
}