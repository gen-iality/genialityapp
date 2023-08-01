import { uploadImageData } from '@/Utilities/uploadImageData';
import { ModalProduct } from '../interfaces/auction.interface';
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
