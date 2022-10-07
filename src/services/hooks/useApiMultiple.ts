import axios from 'axios';
import { useState } from 'react';
import { ApiService, isError, multipleRequest } from '../interfaces/interfaces';
import { ApiUrl } from '@helpers/constants';

export const useApiMultiple = () => {
  const [responseData, setresponseData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<isError>({
    status: false,
    message: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const RequestPromise = async ({ payload, method, request, withCredentials }: ApiService) => {
    return axios[method](`${ApiUrl}${request}`, payload, { withCredentials });
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError({
      status: true,
      message: error.message,
    });
  };

  const handleRequest = async ({ payloads, methods, requests, withCredentials, keys }: multipleRequest) => {
    setIsLoading(true);
    /* setIsError({
      status: false,
      message: '',
    });
    setIsSuccess(false); */
    try {
      let requestToMake = requests.map((request, index) => {
        return [request, methods[index], keys[index], payloads[index], withCredentials[index]];
      });

      requestToMake.map(([request, method, key, payload, withCredentials]) => {
        RequestPromise({ payload, method, request, withCredentials, key }).then((res) => {
          setresponseData((prevState) => {
            return {
              ...prevState,
              [key]: res.data.data,
            };
          });
        });
      });
      setIsLoading(false);
      setIsError({
        status: false,
        message: '',
      });
      setIsSuccess(true);
    } catch (error) {
      handleError(error);
    }
  };

  const useResponse = (key: string): [] => {
    return responseData[key as keyof typeof responseData];
  };

  return {
    isLoading,
    isError,
    isSuccess,
    responseData,
    useResponse,
    handleRequest,
  };
};
