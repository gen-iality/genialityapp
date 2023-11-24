import { useCallback, useEffect, useState } from 'react';
import { CertifiRow } from '@/components/agenda/types';
import { CertsApi } from '@/helpers/request';
import { defaultCertRows } from '../utils';
import { v4 as uuidv4 } from 'uuid';

export const useGetCertificatesRows = (certificatesId: string) => {
  const [certificatesRow, setCertificatesRow] = useState<CertifiRow[]>([]);
  const [isLoadingCertificateRows, setisLoadingCertificateRows] = useState(true);
  const getCertificatesRows = useCallback(async (): Promise<CertifiRow[]> => {
    const data = await CertsApi.getOne(certificatesId);
    return data.content;
  }, [certificatesId]);

  const fetchData = useCallback(async () => {
    try {
      setisLoadingCertificateRows(true);
      const certificateRows = await getCertificatesRows();
      setCertificatesRow(certificateRows);
      setisLoadingCertificateRows(false);
    } catch (error) {
      setCertificatesRow(defaultCertRows);
      setisLoadingCertificateRows(false);
    }
  }, [getCertificatesRows]);

  const handleDragEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const uptadeRows = [...certificatesRow];
      const movedItem = uptadeRows.splice(oldIndex, 1)[0];
      uptadeRows.splice(newIndex, 0, movedItem);
      setCertificatesRow(uptadeRows);
    }
  };

  const handledDelete = (certificateRowId: string) => {
    const newCerticertificatesRow = certificatesRow.filter((certificateRow) => certificateRow.id !== certificateRowId);
    setCertificatesRow(newCerticertificatesRow);
  };

  const handledEdit = (certificatesRowId: string, newRowCertificate: Partial<CertifiRow>) => {
    const newCerticertificatesRow = certificatesRow.map((certificateRow) => {
      if (certificateRow.id === certificatesRowId) return { ...certificateRow, ...newRowCertificate };
      return certificateRow;
    });
    setCertificatesRow(newCerticertificatesRow);
  };

  const handledAdd = (newCertificateRowForm: Omit<CertifiRow, 'id'>) => {
    const newCertificateRow: CertifiRow = { id: uuidv4(), ...newCertificateRowForm };
    setCertificatesRow((current) => [...current, newCertificateRow]);
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    certificatesRow,
    isLoadingCertificateRows,
    handleDragEnd,
    handledDelete,
    handledEdit,
    handledAdd,
  };
};
