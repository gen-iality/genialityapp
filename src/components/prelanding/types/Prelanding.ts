import { Agenda, Description, LandingBlock, Speaker, Sponsor } from "."

export interface PropsPreLanding {
    preview: TypeDivices,
    title?: string
}
export interface PropsSponsor {
    sponsors: Sponsor[]
}

export interface PropsMenuScrollbar { 
    sections:           LandingBlock[] | undefined
    vdescription:       Description[]
    vspeakers:          Speaker[]
    vactividades:       Agenda[]
    vpatrocinadores:    Sponsor[]
}
export type TypeDivices = 'smartphone' | 'tablet' | 'laptop' | 'desktop'