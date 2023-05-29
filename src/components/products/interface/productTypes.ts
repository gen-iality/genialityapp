import { RouteComponentProps } from "react-router";

//tipeo agregar producto 
export interface RouteParams {
    id: string;
    eventId: string;
    event_id: string;
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
export interface useAddProductHookProps extends RouteComponentProps<RouteParams> {
    eventId: string;
}

export interface ImageFile {
    name: string;
    file: File | null ;
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

//tipeo componente configuration
export interface ConfigurationProps {
    eventId: string;
}

// tipeo oferta producto 
export interface OfertProdutsProps extends RouteComponentProps {
    eventId: string;
    match: any;
}
//tipeo productos 
export interface ProductProps extends RouteComponentProps<RouteParams> {
    eventId: string;
}

export interface ProductState {
    list: ProductData[];
    loading: boolean;
    loadingPosition: boolean;
}
export interface ProductData {
    index: number;
    _id: string;
    event_id: string;
    images?: string[];
    name: string;
    by?: string;
    price: number;
    discount?: number;
}