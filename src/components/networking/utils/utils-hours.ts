import moment, { Moment } from "moment";

export const DiffBetweenTwoHours = (hourStart: Moment | string, hourEnd: Moment | string) => {
    if (typeof hourStart === 'string') {
        hourStart = moment(hourStart, 'h:mm a')
    }
    if (typeof hourEnd === 'string') {
        hourEnd = moment(hourEnd, 'h:mm a')
    }

    return Math.floor(moment.duration(hourEnd.diff(hourStart)).asMinutes());
}