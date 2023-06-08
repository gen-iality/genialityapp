import moment, { Moment } from "moment";
import { DiffBetweenTwoHours } from "./utils-hours";
import { IMeetingRequestFirebase, SpaceMeeting, StatusSpace, TimeParameter } from "../interfaces/space-requesting.interface";
import firebase from 'firebase/compat';
import { DateRange } from "react-big-calendar";

const FORMATWITHHOUR = 'YYYY-MM-DD h:mm a'
const FORMAT_WITHOUT_HOUR = 'YYYY-MM-DD'
const FORMAT_HOUR = 'h:mm a'


export const generateSpaceMeetings = (timeParametres: TimeParameter, date: Moment, userId: string, creatorId: string, requestMeetings: IMeetingRequestFirebase[]): SpaceMeeting[] => {
    const stateRequest = (dateStart: firebase.firestore.Timestamp) => {
        let status: StatusSpace = 'avalible'
        const haveRequestMeeting = requestMeetings.filter(requestMeeting => (requestMeeting.dateStartTimestamp.isEqual(dateStart)))
        if (haveRequestMeeting && haveRequestMeeting.length > 0) {
            haveRequestMeeting.forEach((requesMeeting) => {
                switch (requesMeeting.status) {
                    case "confirmed":
                        status = 'not_available'
                        if ((requesMeeting.user_from.id === creatorId && requesMeeting.user_to.id === userId)
                            ||
                            (requesMeeting.user_from.id === userId && requesMeeting.user_to.id === creatorId)
                        ) {
                            status = 'accepted'
                        }
                        if ((requesMeeting.user_from.id === creatorId || requesMeeting.user_to.id === creatorId) && requesMeeting.user_from.id !== userId) status = 'busy-schedule'
                        break
                    case "pending":
                        if (requesMeeting.user_from.id === creatorId && requesMeeting.user_to.id === userId) status = 'requested'

                        break
                    /* case "rejected":
                        if (requesMeeting.user_from.id === creatorId) status = 'rejected'
                        break */
                    default:
                        break
                }
            })
        }
        return status
    }

    const hourStartSpaces = timeParametres.hourStartSpaces.clone()
    const hourFinishSpaces = timeParametres.hourFinishSpaces.clone()

    const diffMinutes = DiffBetweenTwoHours(hourStartSpaces, hourFinishSpaces)
    const iteraciones = diffMinutes / timeParametres.meetingDuration
    const timeSpaces: SpaceMeeting[] = [{
        dateStart: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
            hour: hourStartSpaces.hour(),
            minute: hourStartSpaces.minute(),
            second: hourStartSpaces.second()
        }).toString()).toUTCString())),
        status: "avalible",
        userId,
        dateEnd: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
            hour: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).hour(),
            minute: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).minutes(),
            second: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).seconds()
        }).toString()).toUTCString()))
    }];

    timeSpaces[0].status = stateRequest(timeSpaces[0].dateStart)


    for (let i = 1; i < iteraciones; i++) {
        const hourStart = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).format(FORMATWITHHOUR));
        const hourEnd = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).add(timeParametres.meetingDuration, 'minutes').format(FORMATWITHHOUR));

        const newSpace: SpaceMeeting = {
            dateStart: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
                hour: hourStart.hour(),
                minute: hourStart.minute(),
                second: hourStart.second()
            }).toString()).toUTCString())),
            status: "avalible",
            userId,
            dateEnd: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
                hour: hourEnd.hour(),
                minute: hourEnd.minutes(),
                second: hourEnd.seconds()
            }).toString()).toUTCString()))
        }

        newSpace.status = stateRequest(newSpace.dateStart)

        timeSpaces.push(newSpace);
    }
    return timeSpaces
}


export const generateSpacesByDataRange = (timeParametres: TimeParameter, date: Moment, userId: string, creatorId: string, requestMeetings: IMeetingRequestFirebase[], multiDates: DateRange[]): SpaceMeeting[] => {

    const stateRequest = (dateStart: firebase.firestore.Timestamp) => {
        let status: StatusSpace = 'avalible'
        const haveRequestMeeting = requestMeetings.filter(requestMeeting => (requestMeeting.dateStartTimestamp.isEqual(dateStart)))
        if (haveRequestMeeting && haveRequestMeeting.length > 0) {
            haveRequestMeeting.forEach((requesMeeting) => {
                switch (requesMeeting.status) {
                    case "confirmed":
                        status = 'not_available'
                        if ((requesMeeting.user_from.id === creatorId && requesMeeting.user_to.id === userId)
                            ||
                            (requesMeeting.user_from.id === userId && requesMeeting.user_to.id === creatorId)
                        ) {
                            status = 'accepted'
                        }
                        if ((requesMeeting.user_from.id === creatorId || requesMeeting.user_to.id === creatorId) && requesMeeting.user_from.id !== userId) status = 'busy-schedule'
                        break
                    case "pending":
                        if (requesMeeting.user_from.id === creatorId && requesMeeting.user_to.id === userId) status = 'requested'

                        break
                    /* case "rejected":
                        if (requesMeeting.user_from.id === creatorId) status = 'rejected'
                        break */
                    default:
                        break
                }
            })
        }
        return status
    }

    const currentDataRange = multiDates.find((dateRange => moment(dateRange.start).format(FORMAT_WITHOUT_HOUR) === date.format(FORMAT_WITHOUT_HOUR)))

    const hourStartSpaces = moment(moment(currentDataRange?.start).format(FORMAT_HOUR), FORMAT_HOUR)
    const hourFinishSpaces = moment(moment(currentDataRange?.end).format(FORMAT_HOUR), FORMAT_HOUR)


    const diffMinutes = DiffBetweenTwoHours(hourStartSpaces, hourFinishSpaces)
    const iteraciones = diffMinutes / timeParametres.meetingDuration

    const timeSpaces: SpaceMeeting[] = [{
        dateStart: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
            hour: hourStartSpaces.hour(),
            minute: hourStartSpaces.minute(),
            second: hourStartSpaces.second()
        }).toString()).toUTCString())),
        status: "avalible",
        userId,
        dateEnd: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
            hour: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).hour(),
            minute: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).minutes(),
            second: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format(FORMATWITHHOUR)).seconds()
        }).toString()).toUTCString()))
    }];

    timeSpaces[0].status = stateRequest(timeSpaces[0].dateStart)


    for (let i = 1; i < iteraciones; i++) {
        const hourStart = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).format(FORMATWITHHOUR));
        const hourEnd = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).add(timeParametres.meetingDuration, 'minutes').format(FORMATWITHHOUR));

        const newSpace: SpaceMeeting = {
            dateStart: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
                hour: hourStart.hour(),
                minute: hourStart.minute(),
                second: hourStart.second()
            }).toString()).toUTCString())),
            status: "avalible",
            userId,
            dateEnd: firebase.firestore.Timestamp.fromDate(new Date(new Date(date.set({
                hour: hourEnd.hour(),
                minute: hourEnd.minutes(),
                second: hourEnd.seconds()
            }).toString()).toUTCString()))
        }

        newSpace.status = stateRequest(newSpace.dateStart)

        timeSpaces.push(newSpace);
    }
    
    return timeSpaces
}


