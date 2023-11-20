import { usePaginationListLocal } from '@/hooks/usePaginationListLocal';
import { useCallback, useEffect, useState } from 'react';
import { getListUsersWithOrWithoutBingo } from '../services';
import { IBingoUser } from '../interfaces/bingo';

export const useGetBingoUsers = (eventId: string) => {
  const [bingoUsers, setBingoUsers] = useState<IBingoUser[]>([]);
  const [totalBingoUser, setTotalBingoUser] = useState(0);
  const {
    pagination: { pageSize, current, ...restPagination },
  } = usePaginationListLocal(totalBingoUser);
  const [isLoadingBingoUser, setIsLoadingBingoUser] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoadingBingoUser(true);
    const { data: bingoUser, pagination: paginationRes, error } = await getListUsersWithOrWithoutBingo(
      eventId,
      pageSize,
      current
    );
    if (!error) {
      setBingoUsers(bingoUser);
      if (paginationRes?.total) setTotalBingoUser(paginationRes.total);
      setIsLoadingBingoUser(false);
    } else {
      setBingoUsers([]);
      setIsLoadingBingoUser(false);
    }
  }, [eventId, current, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { bingoUsers, isLoadingBingoUser, pagination: { ...restPagination, current, pageSize } };
};
