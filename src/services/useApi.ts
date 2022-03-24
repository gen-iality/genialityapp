import { useEffect, useState } from 'react';
import { ApiService } from './interfaces/interfaces';
import axios from 'axios';
import { ApiUrl } from '../helpers/constants';

export default function useApiService() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [payloadData, setPayloadData] = useState([]);

  const handleResponse = (response: any) => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(true);
    setPayloadData(response.data.data);
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setIsError(true);
    setIsSuccess(false);
    setError(error.message);
  };

  const handleRequest = async ({ payload, method, request, withCredentials, key }: ApiService) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError('');
    try {
      const response = await axios[method](`${ApiUrl}${request}`, payload, { withCredentials });
      handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  };

  //   useEffect(() => {
  //     handleRequest();
  //     return () => {
  //       setIsLoading(false);
  //       setIsError(false);
  //       setIsSuccess(false);
  //       setError('');
  //     };
  //   }, []);

  return {
    isLoading,
    isError,
    isSuccess,
    error,
    payloadData,
    handleRequest,
  };
}

// import {editProfile} from '../UseCallbacksApi'
// const {isError} = useApiService({
//     payload: {
//        username: 'Mario',
//          password: '123456',
//     },
//     method: 'POST',
//     withCredentials: true || false,
//     // params: {
//     //     id:'1',
//     //     name:'test',
//     //  },
//      modelName;
//      url:editProfile,

// })
