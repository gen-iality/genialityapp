import { useCallback, useEffect, useState } from 'react';
import { ICertificate } from '../types';
import { CertsApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import { handleRequestError } from '@/helpers/utils';
import { imgBackground } from '@/components/agenda/utils/constants';
import { confirmDeleteAsync } from '@/components/ModalConfirm/confirmDelete';

export const useCrudCertificate = (certificateId: string) => {
  const [certificate, setCertificate] = useState<ICertificate>();
  const [isLoadingCertificate, setisLoadingCertificate] = useState(true);
  const [image, setImage] = useState<string>(imgBackground);

  const restoreImage = () => {
    setImage(imgBackground);
  };

  const handleChangeImage = (e: any) => {
    const file = e.file;
    if (file) {
      //Si la imagen cumple con el formato se crea el URL para mostrarlo
      const imageFile = window.URL.createObjectURL(file.originFileObj);
      setImage(imageFile);
      //Se crea un elemento Image para convertir la image en Base64 y tener el tipo y el formato

      let reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);

      reader.onload = () => {
        setImage(reader.result as string);
      };
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Solo se permiten imágenes. Intentalo de nuevo',
        action: 'show',
      });
    }
  };
  const getCertificate = useCallback(async () => {
    const data = await CertsApi.getOne(certificateId);
    return data;
  }, [certificateId]);

  const fetchData = useCallback(async () => {
    try {
      setisLoadingCertificate(true);
      const data = await getCertificate();
      setCertificate(data);
      if (certificate?.background) setImage(certificate?.background);
      setisLoadingCertificate(false);
    } catch (error) {
      setisLoadingCertificate(false);
    }
  }, [certificate?.background, getCertificate]);

  const handledAddCertificate = async (certificate: Omit<ICertificate, '_id'>) => {
    try {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });
      await CertsApi.create(certificate);
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente!',
        action: 'show',
      });
    } catch (error) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(error).message,
        action: 'show',
      });
    }
  };

  const handledEditCertificate = async (certificate: Omit<ICertificate, '_id'>) => {
    try {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });
      await CertsApi.editOne(certificate, certificateId);
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente!',
        action: 'show',
      });
    } catch (error) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(error).message,
        action: 'show',
      });
    }
  };

  const handledDeleteCertificate = async () => {
    const response = await confirmDeleteAsync({
      titleConfirm: `¿Está seguro de eliminar la información?`,
      descriptionConfirm: 'Una vez eliminado, no lo podrá recuperar',
    });
    if (response) {
      try {
        try {
          await CertsApi.deleteOne(certificateId);
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'Se eliminó la información correctamente!',
            action: 'show',
          });
        } catch (e) {
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'error',
            msj: handleRequestError(e).message,
            action: 'show',
          });
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    certificate,
    isLoadingCertificate,
    handledAddCertificate,
    handledEditCertificate,
    handledDeleteCertificate,
    image,
    setImage,
    restoreImage,
    handleChangeImage,
  };
};
