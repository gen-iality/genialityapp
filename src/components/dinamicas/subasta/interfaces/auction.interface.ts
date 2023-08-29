import { UploadFile } from 'antd/lib/upload/interface';

export interface AcutionProps {
    event :  any
}

export interface AuctionConfig {
    name:     string,
	currency: string,
    amount?:  number,
    timerBids: number,
    rules:    string | null
}

export interface DrawerAuctionProps {
    auction:        Auction
    openOrClose :   boolean
    eventId:        string
    cEventUser?:     any
    cEvent?:        any
    setOpenOrClose: ()=> void
}
export interface CardProductProps {
    auction:        Auction
    currentPrice:         number | null
}
export interface GeneralAuctionProps {
    auction: Auction
    eventId: string
}
export interface ApiInterface  {
    getOne:    <T>(event: string) => Promise<T | null>, 
    createOne: <T>(event: string, data: any) => Promise<T> 
    deleteOne: (event: string, subasta_id: string) => Promise<boolean>
    editOne:   <T>(event: string, id: string, data : any) => Promise<T>
    resetProducts:  <T>(event: string) => Promise<T>
}
export interface CreateProps {
    active:   boolean
    auction?: Auction
    event?:    any
}
export interface ProductsProps {
    products: Products[]
    onclick:  (product: Products) => void
    onDelete: (id :string, images : UploadFile[]) => void
}
export interface ModalProps {
    loading:   boolean
    product:    ModalProduct
    onChange:  (newList : any) => Promise<void>
    onSave:    (save : any) => Promise<void>
    onCancel:  (newList : any, update? : boolean) => Promise<void>
}
export interface Auction {
    _id:                string;
    name:               string;
    currency:           ICurrency;
    event_id:           string;
    updated_at:         string;
    created_at:         string;
    styles?:            AuctionStyles
    currentProduct?:    Products | null
    published?:         boolean
    opened?:            boolean
    playing?:           boolean
    amount:            number | null
    timerBids:         number
    rules:             string | null
}
export interface AuctionStyles {
    general?: {
        backgroundColor?:   string
        backgroundImage?:   string
    }
    cards?:       StyleCard
}

interface StyleCard {
    color?: string
    backgroundColor?: string
}
export interface IBids {
    date: string
    productId: string
    productName : string
    name: string
    userId: string
    offered: number
}
export interface Products {
    _id:            string;
    name:           string;
    description:    string;
    images:         UploadFile[];
    start_price:    number;
    price:          number;
    end_price?:     number;
    type:           ProductType;
    state:          ProductState
}

export interface ModalProduct {
    _id? :          string
    name:           string;
    description:    string;
    start_price:    number;
    images:         UploadFile[];
}
export interface ReportProps {
    eventId: string
    reload: boolean
}
export interface DrawerRulesProps {
    showDrawerRules: boolean
    setshowDrawerRules: (value : boolean) => void
    cEvent: any
    auctionRules: string
}
export interface FormatData { 
    productos : string[]
    pujas : number[]
    participants: number[]
    productsName: string[]
    productsPrice: number[]
    productsIncreases: number[]
}
export interface ButtonsContainerProps {
    validate: boolean
    onClick: () => void
	setshowDrawerChat: React.Dispatch<React.SetStateAction<boolean>>
	setshowDrawerRules: React.Dispatch<React.SetStateAction<boolean>>
	closedrawer: () => void
    styles?: React.CSSProperties
    timer: number
}
export interface ImagesData { 
    file :  UploadFile;
    fileList:  UploadFile[];
}

export interface DrawerChat {
    showDrawerChat: boolean
    setshowDrawerChat : (value : boolean) => void
}
export type ProductState = 'waiting' | 'progress' | 'auctioned'
export type ProductType = 'just-auction' | 'just-store' | 'auction-store'
export type ICurrency = 'COP' | 'USD'