import { DispatchMessageService } from '@/context/MessageService';
import { handleRequestError, uploadImage } from '@/helpers/utils';

export const uploadImageData = async (image: string | object) => {
  let imagenUrl = null;
  if (image && typeof image === 'object') {
    try {
      imagenUrl = await uploadImage(image);
    } catch (e) {
      imagenUrl = null;
      DispatchMessageService({
        type: 'error',
        msj: `Error al guardar la imagen: ${handleRequestError(e).message}`,
        action: 'show',
        duration: 8,
      });
    }
  }
  if (typeof image === 'string') {
    imagenUrl = image;
  }
  return imagenUrl;
};
