import { notification } from 'antd';
import { keys, pick } from 'ramda';
import { useCallback, useEffect, useState } from 'react';

import { getEventCompany } from '../services';

const defaultInitialValues = {
  name: '',
  stand_type: undefined,
  visible: false,
};

function useGetCompanyInitialValues(eventId, companyId) {
  const [data, setData] = useState(defaultInitialValues);
  const [loadingData, setLoadingData] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(true);

  const reloadData = useCallback(() => {
    setReloadFlag(!reloadFlag);
  }, [reloadFlag]);

  useEffect(() => {
    if (companyId) {
      setLoadingData(true);

      getEventCompany(eventId, companyId)
        .then((res) => {
          const formKeys = keys(defaultInitialValues);
          const newInitialValues = pick(formKeys, res);

          setData(newInitialValues);
        })
        .catch((error) => {
          console.error(error);

          notification.error({
            message: 'Error',
            description: 'Error obteniendo los valores iniciales',
          });
        })
        .finally(() => setLoadingData(false));
    } else {
      setData(defaultInitialValues);
      setLoadingData(false);
    }
  }, [reloadFlag, eventId, companyId]);

  return [data, loadingData, reloadData];
}

export default useGetCompanyInitialValues;
