import { useCallback, useEffect, useState } from 'react';
import { ICertificado } from '../types';
import { CertsApi } from '@/helpers/request';

export const useGetCertificate = (certificateId: string) => {
  const [certificate, setCertificate] = useState<ICertificado>();
  const [isLoadingCertificate, setisLoadingCertificate] = useState(true);

  const getCertificate = useCallback(async () => {
    const data = await CertsApi.getOne(certificateId);
    return data;
  }, [certificateId]);

  const fetchData = useCallback(async () => {
    try {
      setisLoadingCertificate(true);
      const data = await getCertificate();
      setCertificate(data);
      setisLoadingCertificate(false);
    } catch (error) {
      setisLoadingCertificate(false);
    }
  }, [getCertificate]);

 
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    certificate,
    isLoadingCertificate,
  };
};
