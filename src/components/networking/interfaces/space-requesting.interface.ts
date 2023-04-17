import { Moment } from "moment";
import firebase from 'firebase/compat';
import { IMeeting } from "./Meetings.interfaces";

export interface TimeParameter {
    meetingDuration: number;
    hourStartSpaces: Moment
    hourFinishSpaces: Moment
}

export type StatusSpace = 'avalible' | 'requested' | 'not_available' | 'rejected' | 'accepted'

export interface SpaceMeeting {
    dateStart: firebase.firestore.Timestamp,
    dateEnd: firebase.firestore.Timestamp
    status: StatusSpace
    userId: string
}

export interface SpaceMeetingFirebase extends SpaceMeeting {
    id: string
}

export interface IMeetingRequestFirebase {
    id: string
    user_to: IUserMeetingRequest;
    user_from: IUserMeetingRequest;
    meeting: IMeeting,
    date: string;
    dateStartTimestamp: firebase.firestore.Timestamp,
    message: string,
    status: TRequestMeetingState,
    timestamp: number
}

export interface IUserMeetingRequest {
    id: string;
    name: string;
    email: string;
}

export type TRequestMeetingState = 'pending' | 'rejected' | 'confirmed' 