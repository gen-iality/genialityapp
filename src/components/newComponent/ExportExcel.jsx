// import React from 'react';
// import ReactExport from 'react-data-export';
// import { Button } from 'antd';
// import { DownloadOutlined } from '@ant-design/icons';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const ExportExcel = ( props ) => {
//   const { columns, list, fileName } = props;
  
//   return (
//     <ExcelFile element={<Button type='primary' icon={<DownloadOutlined />}>Exportar</Button>}>
//       <ExcelSheet data={list} name={fileName} >
//         {
//           columns.map(column => (
//             <ExcelColumn label={column.title} value={column.dataIndex} />
//           ))
//         }
//       </ExcelSheet>
//     </ExcelFile>
//   );
// }

// export default ExportExcel;

import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd'
import React from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';

export const ExportExcel = (props) => {

  const exportData=()=>{
    if(props.list){   
    const wb=XLSX.utils.book_new()
    const ws=XLSX.utils.json_to_sheet(props.list)
    XLSX.utils.book_append_sheet(wb,ws,"Datos")
    XLSX.writeFile(wb,props.fileName+".xlsx")
    }else{
      message.error("No hay datos que exportar")
    }
  }
  return (
    <div>
      <Button primary onClick={exportData}>
      <DownloadOutlined /> Exportar
      </Button>
    </div>
  )
}
