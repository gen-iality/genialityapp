// import ReactExport from 'react-data-export';
// import { Button } from 'antd';
// import { DownloadOutlined } from '@ant-design/icons';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const ExportExcel = (props) => {
//   const { columns, list, fileName } = props;

//   return (
//     <ExcelFile
//       element={
//         <Button type='primary' icon={<DownloadOutlined />}>
//           Exportar
//         </Button>
//       }>
//       <ExcelSheet data={list} name={fileName}>
//         {columns.map((column) => (
//           <ExcelColumn label={column.title} value={column.dataIndex} />
//         ))}
//       </ExcelSheet>
//     </ExcelFile>
//   );
// };

// export default ExportExcel;

import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx/xlsx.mjs';
import { DispatchMessageService } from '../../context/MessageService';

export const ExportExcel = (props) => {
  const exportData = () => {
    if (props.list) {
      // console.log({ oldList: props.list })
      const newlist = props.list.map(obj => {
        let newObj = {}
        Object.keys(obj).map(key => {
          if (Array.isArray(obj[key])) {
            newObj[key] = obj[key].join(',')
          } else {
            newObj[key] = obj[key]
          }
        })
        return newObj
      })
      // console.log({ newlist })
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newlist);
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      XLSX.writeFile(wb, props.fileName + '.xlsx');
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'No hay datos que exportar',
        action: 'show',
      })
    }
  };
  return (
    <div>
      <Button primary onClick={exportData}>
        <DownloadOutlined /> Exportar
      </Button>
    </div>
  );
};