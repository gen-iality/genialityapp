import { uploadImageData } from '@/Utilities/uploadImageData';
import { Auction, ModalProduct } from '../interfaces/auction.interface';
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
  setProductSelect: React.Dispatch<React.SetStateAction<ModalProduct>>,
  newFileList: UploadFile[]
) => {
  const success = 'file deleted successfully'
  if (file.url || file.response?.url) {
    const response = await deleteFireStorageData(file.url || file.response.url);
    if (response === success) setProductSelect((prev) => ({ ...prev, images: newFileList }));
  } else {
    DispatchMessageService({ type: 'error', msj: 'No se encontro la ruta de la imagen', action: 'show' });
  }
};

export enum TabsDrawerAuction {
  Bids = 'Bids',
  History = 'History',
}

export const InitialModalState: ModalProduct = {
  description: '',
  images: [],
  start_price: 0,
  name: '',
  state: 'waiting',
};

export const AuctionExample : Required<Auction> = {
  _id: '1',
  created_at: '2021-08-10T17:00:00.000Z',
  currency: 'COP',
  event_id: '1',
  name: 'Subasta de prueba',
  updated_at: '2021-08-10T17:00:00.000Z',
  currentProduct: {
    _id: '1',
    description: 'Producto de prueba',
    name  : 'Producto de prueba',
    price : 0,
    start_price : 0,
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
