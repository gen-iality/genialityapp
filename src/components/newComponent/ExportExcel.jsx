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

export const ExportExcel = () => {
  return <div></div>;
};
