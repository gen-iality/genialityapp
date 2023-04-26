import { IMeeting } from "./Meetings.interfaces";
import firebase from 'firebase/compat';

export interface IRequestCard {
  received : boolean;
  data: IRequestMeenting;
  fetching: boolean;
  setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  notificacion: any;
  setSendRespuesta:  React.Dispatch<React.SetStateAction<boolean>>;
}


export interface IRequestMeenting {
    id : string
    user_to : userRequest,
    user_from : userRequest,
    meeting : IMeeting,
    date: string;
    dateStartTimestamp:firebase.firestore.Timestamp
    message : string;
    status: string;
    timestamp : number
}


interface userRequest {
    id : string,
    name : string
    email : string
  }