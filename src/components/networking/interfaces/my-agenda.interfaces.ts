import { IMeeting } from "./Meetings.interfaces";

export interface DailyMeeting {
    date: string;
    meetings: IMeeting[];
}