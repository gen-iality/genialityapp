import { notification } from 'antd';
import { capitalize } from 'lodash'
import { map } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { useCallback, useEffect, useState } from 'react';

import { getEventCompaniesSocialNetworks } from '../services';

function stringToOptionMapper(value) {
  return {
    value,
    label: capitalize(value),
  };
}

function useGetEventCompaniesSocialNetworksOptions(eventId) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(true);

  const reloadData = useCallback(() => {
    setReloadFlag(!reloadFlag);
  }, [reloadFlag]);

  useEffect(() => {
    setLoadingData(true);
    setData([]);

    getEventCompaniesSocialNetworks(eventId)
      .then((res) => {
        if (isNonEmptyArray(res)) {
          const options = map(stringToOptionMapper, res);
          setData(options);
        }
      })
      .catch((error) => {
        console.error(error);

      /*  notification.error({
          message: 'Error',
          description: 'Error obteniendo las redes sociales',
        });*/
      })
      .finally(() => setLoadingData(false));
  }, [reloadFlag, eventId]);

  return [data, loadingData, reloadData];
}

export default useGetEventCompaniesSocialNetworksOptions;
