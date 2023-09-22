export interface ISpaces {
    label: string;
    value: string
}

export interface ISpacesFirebase extends ISpaces {
    id: string;
}

export interface ISpacesForm {
    nameSpace: string;
}