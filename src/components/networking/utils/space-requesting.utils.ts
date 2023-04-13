import moment, { Moment } from "moment";
import { DiffBetweenTwoHours } from "./utils-hours";
import { SpaceMeeting, SpaceMeetingFirebase, TimeParameter } from "../interfaces/space-requesting.interface";

export const generateSpaceMeetings = (timeParametres: TimeParameter, date: Moment | string, userId: string): SpaceMeeting[] => {
    if (typeof date !== "string") {
        date = date.format('YYYY-MM-DD')
    }

    const timeSpaces: SpaceMeeting[] = [{ hourStart: timeParametres.hourStartSpaces.format('h:mm a'), date, status: "avalible", userId }];

    const diffMinutes = DiffBetweenTwoHours(timeParametres.hourStartSpaces, timeParametres.hourFinishSpaces)
    const iteraciones = diffMinutes / timeParametres.meetingDuration
    // Crea un bucle que itere desde la hora inicial hasta la hora final deseada
    for (let i = 1; i < iteraciones; i++) {
        // Suma el intervalo de tiempo en minutos a la hora actual
        const horaActual = moment(timeSpaces[timeSpaces.length - 1].hourStart, 'h:mm a').add(timeParametres.meetingDuration, 'minutes');

        // Convierte la hora en formato de cadena de texto y agrégala al array de horas
        timeSpaces.push({ hourStart: horaActual.format('h:mm a'), date, status: "avalible", userId });
    }
    return timeSpaces
}

export const sortArraySpaceMeetings = (spacesMeetings: SpaceMeetingFirebase[]) => {
    return spacesMeetings.sort((item_1, item_2) => {
        const momentA = moment(item_1.hourStart, 'h:mm a');
        const momentB = moment(item_2.hourStart, 'h:mm a');
        return momentA.diff(momentB);
    });
    
}