import { notification } from 'antd';
import { mergeDeepRight, pick } from 'ramda';
import { useCallback, useEffect, useState } from 'react';

import { getEventCompany } from '../services';
import { defaultInitialValues, companyFormKeys } from '../crearEditarEmpresa';

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
          const resValues = pick(companyFormKeys, res);
          const newInitialValues = mergeDeepRight(defaultInitialValues, resValues);

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
