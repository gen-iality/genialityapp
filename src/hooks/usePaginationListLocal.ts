import  { useState } from 'react'

export const usePaginationListLocal = (listLength:number,pageSizeDefault:number = 10, currentSizeDefault:number = 1) => {
    const [currentPage, setcurrentPage] = useState(currentSizeDefault);
    const [pageSize, setpageSize] = useState(pageSizeDefault);


    const onChangeCurrnetPage = (page: number) => {
        setcurrentPage(page);
      };
    
      const onChangePageSize = (pageSize: number) => {
        setpageSize(pageSize);
      };
  
      

  return {
    pagination:{
        pageSize,
        current: currentPage,
        onChange: onChangeCurrnetPage,
        total: listLength,
        onShowSizeChange: (page:number, pageSize:number) => {
          onChangeCurrnetPage(page);
          onChangePageSize(pageSize);
        }
      }
  }
}
