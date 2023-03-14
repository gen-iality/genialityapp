
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
    name   : string
    email? : string
    phone? : string
    attendance  : boolean
    id:string
}

