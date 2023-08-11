import { uploadImageData } from '@/Utilities/uploadImageData';
import { Auction, IBids, Products } from '../interfaces/auction.interface';
import { UploadFile } from 'antd/lib/upload/interface';
import { deleteFireStorageData } from '@/Utilities/deleteFireStorageData';
import { DispatchMessageService } from '@/context/MessageService';

export const uploadImagedummyRequest = async ({ file, onSuccess, onError }: any) => {
  const imagenUrl = await uploadImageData(file);
  if (imagenUrl) { 
    onSuccess({ url: imagenUrl });
  } else {
    onError('error');
  }
};

export const deleteImage = async (
  file: UploadFile,
  setProductSelect: React.Dispatch<React.SetStateAction<Products>> = () => {},
  newFileList: UploadFile[] = []
) => {
  const success = 'file deleted successfully'
  if (file.url || file.response?.url) {
    const response = await deleteFireStorageData(file.url || file.response.url);
    if (response === success && setProductSelect) setProductSelect((prev) => ({ ...prev, images: newFileList }));
  } else {
    DispatchMessageService({ type: 'error', msj: 'No se encontro la ruta de la imagen', action: 'show' });
  }
};

export enum TabsDrawerAuction {
  Bids = 'Bids',
  History = 'History',
}

export const InitialModalState : Products = {
  description: '',
  images: [],
  start_price: 0,
  name: '',
  _id: '',
  state: 'waiting',
  price : 0,
  type : 'just-auction',
};

export const AuctionExample : Required<Auction> = {
  _id: '1',
  created_at: '2021-08-10T17:00:00.000Z',
  currency: 'COP',
  event_id: '1',
  name: 'Subasta de prueba',
  updated_at: '2021-08-10T17:00:00.000Z',
  styles: {
  },
  currentProduct: {
    _id: '1',
    description: 'Producto de prueba',
    name  : 'Producto de prueba',
    price : 10000,
    start_price : 10000,
    type : 'just-auction',
    state: 'waiting',
    images : [{
      name: 'imagen',
      url: 'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/ilustracion-moderna-concepto-computadora-escritorio_114360-11616.avif?alt=media&token=9b89201d-9ad9-486a-95b4-a976277ef97b',
      uid: '1'
    }]
  },
  opened  : false,
  playing : false,
  published : false
}

export const orgOfferds = (Bids : IBids[]) => {
  const labels : string[] = []
  const values : any[] = []
  const participants : any[] = []
  Bids.forEach((bid) => {
    if(!labels.includes(bid.productName)) {
      labels.push(bid.productName)
      values.push(1)
    }else {
      const index = labels.findIndex((label) => label === bid.productName)
      values[index] += 1
      participants[index] = filterUserID(Bids,bid.productId).length
    }

  })

  return {labels,values, participants}
}



export const filterUserID = (array : IBids[],product? : string) => {
  const userIdMap = new Map();
  return array.reduce((resultado :any[], objeto) => {
    const  validateProduct = product ? objeto.productId === product : true
    if (!userIdMap.has(objeto.userId) && validateProduct) {
      userIdMap.set(objeto.userId, true);
      resultado.push(objeto);
    }
    return resultado;
  }, []);
}


export const priceChartValues = (products : Products[]) => {
  const startPrices : number[] = []
  const increases : number[] = []
  const auctioneds = products.filter((product) => product.state === 'auctioned')
  auctioneds.forEach((product) => {
      startPrices.push(product.start_price)
      increases.push( product.price - product.start_price)
  })
  
  return { 
    labelsProducts: auctioneds.map((product) => product.name),
    startPrices,
    increases
  }
}