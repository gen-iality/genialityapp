
export interface IMeetingList {
    meentings : IMeeting[]
    
}
export interface IMeeting {
    id:string
    name  : string
    date  : string  | Date
    place : string
    participants : IParticipants[]
}

export interface IParticipants {
    id:string
    name   : string
    email? : string
    phone? : string
    attendance  : string
}

