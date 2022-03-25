import { useState } from 'react';
import { ApiService, isError } from './interfaces/interfaces';
import axios from 'axios';
import { ApiUrl } from '../helpers/constants';

export default function useApiService() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<isError>({
    status: false,
    message: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [responseData, setPayloadData] = useState({});

  const handleResponse = (response: any, key: string) => {
    setIsLoading(false);
    setIsError({
      status: false,
      message: '',
    });
    setIsSuccess(true);
    setPayloadData({
      ...responseData,
      [key]: response.data.data,
    });
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError({
      status: true,
      message: error.message,
    });
  };

  const handleRequest = async ({ payload, method, request, withCredentials, key }: ApiService) => {
    setIsLoading(true);
    setIsError({
      status: false,
      message: '',
    });
    setIsSuccess(false);
    try {
      const response = await axios[method](`${ApiUrl}${request}`, payload, { withCredentials });
      handleResponse(response, key);
    } catch (error) {
      handleError(error);
    }
  };

  const useResponse = (key: string): [] => {
    console.log('para esta key', key, 'este result', responseData[key as keyof typeof responseData]);
    return responseData[key as keyof typeof responseData];
  };

  return {
    isLoading,
    isError,
    isSuccess,
    handleRequest,
    useResponse,
    responseData,
  };
}
