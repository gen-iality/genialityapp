import { IMeeting } from "./Meetings.interfaces";


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
    date: string,
    message : string,
    status: string
}


interface userRequest {
    id : string,
    name : string
    email : string
  }