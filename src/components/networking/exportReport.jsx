//import  { Component } from 'react';
// import ReactExport from 'react-data-export';
// import { Button } from 'antd';
// import { DownloadOutlined } from '@ant-design/icons';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// export default class ExportReport extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       invitations: this.props.invitations,
//     };
//   }

//   render() {
//     const { invitations } = this.state;
//     return (
//       <ExcelFile element={<Button type='primary' icon={<DownloadOutlined />}>Exportar</Button>}>
//         <ExcelSheet data={invitations} name='Employees'>
//           <ExcelColumn label='Usuario' value='user_name_requesting' />
//           <ExcelColumn label='Usuario quien responde' value='user_name_requested' />
//           <ExcelColumn label='Estado' value='state' />
//           <ExcelColumn label='Respuesta' value='response' />
//           <ExcelColumn label='Registro creado' value='created_at' />
//           <ExcelColumn label='Registro actualizado' value='updated_at' />
//         </ExcelSheet>
//       </ExcelFile>
//     );
//   }
// }

export const exportReport = () => {
  return <div></div>;
};
