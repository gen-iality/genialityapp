import { Certificates } from '@/components/agenda/types';
import { haveUserCertificate } from '@/components/eventOrganization/utils/certificates.utils';
import { UsersApi } from '@/helpers/request';
import { PaginationConfig } from 'antd/lib/pagination';
import { useEffect, useState } from 'react';

export const useGetEventUserWithCertificate = (certificate: Certificates | undefined, eventId: string) => {
  const [userEventUserWithCertificate, setUserEventUserWithCertificate] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setcurrentPage] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  

  const onChangeCurrnetPage = (page: number) => {
    setcurrentPage(page);
  };

  const onChangePageSize = (pageSize: number) => {
    setpageSize(pageSize);
  };


  const getEventUser = async() =>{
    try {
        const {data} = await UsersApi.getAll(eventId)
        return data
    } catch (error) {
        return []
    }
}


  const getData = async () => {
    if(!certificate){
      setisLoading(false)
      setUserEventUserWithCertificate([])
      return 
    }
    const eventUsersByEvent = await getEventUser()
    const eventUser = eventUsersByEvent.filter((eventUser:any) => {
      return haveUserCertificate(certificate, eventUser.properties.list_type_user);
    });
    setisLoading(false)
    setUserEventUserWithCertificate(eventUser)
  };

  useEffect(() => {
    getData();
  }, [eventId]);

  return {
    userEventUserWithCertificate,
    isLoading,
    pagination:{
      pageSize,
      current: currentPage,
      onChange: onChangeCurrnetPage,
      total: userEventUserWithCertificate.length,
      onShowSizeChange: (page:number, pageSize:number) => {
        onChangeCurrnetPage(page);
        onChangePageSize(pageSize);
      },
    } 
  };
};
