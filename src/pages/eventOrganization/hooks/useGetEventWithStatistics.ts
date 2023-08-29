import { useEffect, useState } from 'react'
import { OrganizationApi } from '@/helpers/request';

export const useGetEventWithStatistics = (organizationId:string) => {
    const [eventData, setEventData] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [currentPage, setcurrentPage] = useState(1);
    const [pageSize, setpageSize] = useState(10);
  
    const onChangeCurrnetPage = (page: number) => {
      setcurrentPage(page);
    };
  
    const onChangePageSize = (pageSize: number) => {
      setpageSize(pageSize);
    };
  
  
  
  
  
    const getData = async () => {
      try {
        const { data } = await OrganizationApi.getEventsStatistics(organizationId, 'latest');
        setEventData(data)
      } catch (error) {
        setEventData([])
      }finally{
        setisLoading(false)
      }
    };
  
    useEffect(() => {
      getData();
    }, [organizationId]);
  
    return {
        eventData,
      isLoading,
      pagination:{
        pageSize,
        current: currentPage,
        onChange: onChangeCurrnetPage,
        total: eventData.length,
        onShowSizeChange: (page:number, pageSize:number) => {
          onChangeCurrnetPage(page);
          onChangePageSize(pageSize);
        }
      }
    };
}
