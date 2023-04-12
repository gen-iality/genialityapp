import { Moment } from "moment";

export interface TimeParameter {
    meetingDuration: number;
    hourStartSpaces: Moment
    hourFinishSpaces: Moment
}

export type StatusSpace = 'avalible' | 'no-avalible'

export interface SpaceMeeting {
    date: string;
    hourStart: string,
    status: StatusSpace
    userId: string
}

export interface SpaceMeetingFirebase extends SpaceMeeting {
    id: string
}