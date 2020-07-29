import { notification } from 'antd';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useCallback, useEffect, useState } from 'react';

import { getEventCompanies } from '../services';

function useGetEventCompanies(eventId) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(true);

  const reloadData = useCallback(() => {
    setReloadFlag(!reloadFlag);
  }, [reloadFlag]);

  useEffect(() => {
    setLoadingData(true);
    setData([]);

    getEventCompanies(eventId)
      .then((res) => {
        if (isNonEmptyArray(res)) {
          setData(res);
        }
      })
      .catch((error) => {
        console.error(error);

        notification.error({
          message: 'Error',
          description: 'Error obteniendo las empresas',
        });
      })
      .finally(() => setLoadingData(false));
  }, [reloadFlag, eventId]);

  return [data, loadingData, reloadData];
}

export default useGetEventCompanies;
