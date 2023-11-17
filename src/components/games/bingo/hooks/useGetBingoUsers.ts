import { usePaginationListLocal } from '@/hooks/usePaginationListLocal';
import { useCallback, useEffect, useState } from 'react';
import { getListUsersWithOrWithoutBingo } from '../services';
import { IBingoUser } from '../interfaces/bingo';

export const useGetBingoUsers = (eventId: string) => {
  const [bingoUsers, setBingoUsers] = useState<IBingoUser[]>([]);
  const [totalBingoUser, setTotalBingoUser] = useState(0);
  const { pagination } = usePaginationListLocal(totalBingoUser);
  const [isLoadingBingoUser, setIsLoadingBingoUser] = useState(true);
  
  const fetchData = useCallback(async () => {
    setIsLoadingBingoUser(true);
    const { data: bingoUser, pagination: paginationRes, error } = await getListUsersWithOrWithoutBingo(
      eventId,
      pagination.pageSize,
      pagination.current
    );
    if (!error) {
      setBingoUsers(bingoUser);
      if (paginationRes?.total) setTotalBingoUser(paginationRes.total);
      setIsLoadingBingoUser(false);
    } else {
      setBingoUsers([]);
      setIsLoadingBingoUser(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { bingoUsers, isLoadingBingoUser, pagination };
};
