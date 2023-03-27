export interface IObserver {
    id : string
    label: string;
    value : string;
}


export interface CreateObservers {
    data : string[]
}


export enum TypeCalendarView {
    day = "day", 
    week = "week", 
    month ="month", 
    agenda ="agenda"
}