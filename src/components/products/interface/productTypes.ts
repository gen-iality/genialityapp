import { RouteComponentProps } from "react-router";

//tipeo agregar producto 
export interface RouteParams {
    id: string;
}
export interface Validators {
    price: boolean;
    creator: boolean;
    name: boolean;
    description: boolean;
    picture: boolean;
}
export interface AddProductProps extends RouteComponentProps<RouteParams> {
    eventId: string;
}

export interface ImageFile {
    name: string;
    file: File | null;
}

export interface Product {
    by: string;
    description: string;
    discount: null | number;
    images: string[];
    name: string;
    price: string;
    type: string;
    _id: string;
}

