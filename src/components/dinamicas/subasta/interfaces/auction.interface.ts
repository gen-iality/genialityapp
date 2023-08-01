import { UploadFile } from 'antd/lib/upload/interface';
import DrawerAuction from '../components/landing/DrawerAuction';
export interface AuctionConfig {
    name:     string,
	currency: string,

}

export interface DrawerAuctionProps {
    auction: Auction
    openOrClose : boolean
    eventId: string
    setOpenOrClose: ()=> void
}
export interface ApiInterface  {
    getOne:    <T>(event: string) => Promise<T | null>, 
    createOne: <T>(event: string, data: any) => Promise<T> 
    deleteOne: (event: string, subasta_id: string) => Promise<boolean>
    editOne:   <T>(event: string, id: string, data : any) => Promise<T>
}
export interface CreateProps {
    active:   boolean
    auction?: Auction
}
export interface ProductsProps {
    products: Products[]
    onclick:  (product: Products) => void
    onDelete: (id :string, images : UploadFile[]) => void
}
export interface ModalProps {
    product : ModalProduct
    onChange :  (newList : any) => Promise<void>
    onSave :    (save : any) => Promise<void>
    onCancel :  (newList : any, update? : boolean) => Promise<void>
}
export interface Auction {
    _id:        string;
    name:       string;
    currency:   ICurrency;
    event_id:   string;
    updated_at: string;
    created_at: string;
    currentProduct?: Products | null
    published? : boolean
    opened? : boolean
    playing? : boolean
}

export interface IBids {
    date: string
    name: string
    offered: number
}
export interface Products {
    _id:         string;
    name:        string;
    description: string;
    images:      UploadFile[];
    start_price:  number;
    price:        number;
    end_price?:    number;
    type:        ProductType;
    state:       ProductState
}

export interface ModalProduct {
    _id? :        string
    name:        string;
    description: string;
    start_price:  number;
    state:       ProductState
    images:       UploadFile[];
}

export interface ImagesData { 
    file :  UploadFile;
    fileList:  UploadFile[];
}


export type ProductState = 'waiting' | 'progress' | 'auctioned'
export type ProductType = 'just-auction' | 'just-store' | 'auction-store'
export type ICurrency = 'COP' | 'USD'