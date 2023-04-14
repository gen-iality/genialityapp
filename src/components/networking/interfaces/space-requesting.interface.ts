import { Moment } from "moment";
import firebase from 'firebase/compat';

export interface TimeParameter {
    meetingDuration: number;
    hourStartSpaces: Moment
    hourFinishSpaces: Moment
}

export type StatusSpace = 'avalible' | 'requested' | 'not_available'

export interface SpaceMeeting {
    dateStart: firebase.firestore.Timestamp,
    dateEnd: firebase.firestore.Timestamp
    status: StatusSpace
    userId: string
}

export interface SpaceMeetingFirebase extends SpaceMeeting {
    id: string
}