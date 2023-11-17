import { BingoApi } from '@/helpers/request';
import { IResultGet } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { BingoCarton } from '../interfaces/bingo';
import { usePaginationListLocal } from '@/hooks/usePaginationListLocal';
import { handledErrorBingoCarton } from '../services/bingo-cartons.service';

export const useGetBingoCartons = (bingoId: string, withowAsigmed: boolean | undefined) => {
  const [bingoCartons, setBingoCartons] = useState<BingoCarton[]>([]);
  const [totalBingoCartons, setTotalBingoCartons] = useState(0);
  const { pagination } = usePaginationListLocal(totalBingoCartons);
  const [isLoadingBingoCartons, setIsLoadingBingoCartons] = useState(true);
  const [error, setError] = useState<BingoCarton>();

  const getBingoCartons = useCallback(
    async (numberItems: number = 10, page: number = 1): Promise<IResultGet<BingoCarton[]>> => {
      try {
        const bingoCartons = await BingoApi.getBingoCartons(bingoId, numberItems, page, withowAsigmed);
        return {
          error: null,
          data: bingoCartons.data,
          pagination: {
            current_page: bingoCartons.current_page,
            total: bingoCartons.total,
          },
        };
      } catch (error) {
        return { data: [], error };
      }
    },
    [bingoId]
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingBingoCartons(true);
      const bingoCartons = await getBingoCartons(pagination.pageSize, pagination.current);
      setIsLoadingBingoCartons(false);
      if (bingoCartons.error) {
        setBingoCartons([]);
        setError(bingoCartons.error);
        handledErrorBingoCarton('get');
        return;
      }
      setBingoCartons(bingoCartons.data);
      if (bingoCartons.pagination?.total !== undefined) setTotalBingoCartons(bingoCartons.pagination?.total);
    } catch (error) {
      setIsLoadingBingoCartons(false);
      setBingoCartons([]);
    }
  }, [getBingoCartons, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    bingoCartons,
    isLoadingBingoCartons,
    error,
    pagination,
    fetchData,
    getBingoCartons,
  };
};
