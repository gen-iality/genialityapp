import moment, { Moment } from "moment";
import { DiffBetweenTwoHours } from "./utils-hours";
import { IMeetingRequestFirebase, SpaceMeeting, SpaceMeetingFirebase, StatusSpace, TimeParameter } from "../interfaces/space-requesting.interface";
import firebase from 'firebase/compat';

export const generateSpaceMeetings = (timeParametres: TimeParameter, date: Moment, userId: string, spacesMeetingsAgended: SpaceMeetingFirebase[], requestMeetings: IMeetingRequestFirebase[]): SpaceMeeting[] => {
    const isAvalible = (dateStart: firebase.firestore.Timestamp) => {
        const haveAgendedMeeting = spacesMeetingsAgended.filter(spaceMeeting => (spaceMeeting.dateStart.isEqual(dateStart)))
        return haveAgendedMeeting.length === 0
    }
    const stateRequest = (dateStart: firebase.firestore.Timestamp) => {
        const haveRequestMeeting = requestMeetings.find(requestMeeting => (requestMeeting.dateStartTimestamp.isEqual(dateStart)))
        return haveRequestMeeting?.status
    }

    const getStatusSpace = (dateStart: firebase.firestore.Timestamp): StatusSpace => {
        if (stateRequest(dateStart) === 'pending') return 'requested'
        if (stateRequest(dateStart) === 'rejected') return 'rejected'
        if (stateRequest(dateStart) === 'confirmed') return 'not_available'
        // if (!isAvalible(dateStart)) return 'not_available'
        return 'avalible'
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
            hour: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format('YYYY-MM-DD h:mm a')).hour(),
            minute: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format('YYYY-MM-DD h:mm a')).minutes(),
            second: moment(moment(hourStartSpaces.clone().add(timeParametres.meetingDuration, 'minutes')).format('YYYY-MM-DD h:mm a')).seconds()
        }).toString()).toUTCString()))
    }];

    timeSpaces[0].status = getStatusSpace(timeSpaces[0].dateStart)


    for (let i = 1; i < iteraciones; i++) {
        const hourStart = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).format('YYYY-MM-DD h:mm a'));
        const hourEnd = moment(moment(timeSpaces[i - 1].dateEnd.toDate()).add(timeParametres.meetingDuration, 'minutes').format('YYYY-MM-DD h:mm a'));

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

        newSpace.status = getStatusSpace(newSpace.dateStart)

        timeSpaces.push(newSpace);
    }
    return timeSpaces
}


