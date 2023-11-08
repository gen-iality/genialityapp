import { useState } from 'react';
import { imgBackground } from '../utils/constants';
import { DispatchMessageService } from '@/context/MessageService';

export const useImageCertificate = () => {
  const [image, setImage] = useState<string>(imgBackground);

  const onChangeCertificateImage = (value: string) => {
    setImage(value);
  };

  const restoreImage = () => {
    setImage(imgBackground);
  };

  const handleChangeImage = (e: any) => {
    const file = e.file;
    if (file) {
      //Si la imagen cumple con el formato se crea el URL para mostrarlo
      const imageFile = window.URL.createObjectURL(file.originFileObj);
      onChangeCertificateImage(imageFile);
      //Se crea un elemento Image para convertir la image en Base64 y tener el tipo y el formato

      let reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);

      reader.onload = () => {
        onChangeCertificateImage(reader.result as  string);
      };
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Solo se permiten imágenes. Intentalo de nuevo',
        action: 'show',
      });
    }
  };

  return { image, onChangeCertificateImage, restoreImage, handleChangeImage };
};
