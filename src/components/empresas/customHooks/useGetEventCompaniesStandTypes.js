import { notification } from 'antd';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useCallback, useEffect, useState } from 'react';

import { getEventCompaniesStandTypes } from '../services';

function useGetEventCompaniesStandTypes(eventId) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(true);

  const reloadData = useCallback(() => {
    setReloadFlag(!reloadFlag);
  }, [reloadFlag]);

  useEffect(() => {
    setLoadingData(true);
    setData([]);

    getEventCompaniesStandTypes(eventId)
      .then((res) => {
        if (isNonEmptyArray(res)) {
          setData(res);
        }
      })
      .catch((error) => {
        console.error(error);

        notification.error({
          message: 'Error',
          description: 'Error obteniendo los tipos de stand de las empresas',
        });
      })
      .finally(() => setLoadingData(false));
  }, [reloadFlag, eventId]);

  return [data, loadingData, reloadData];
}

export default useGetEventCompaniesStandTypes;
