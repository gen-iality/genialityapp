import React from 'react';
import ReactExport from 'react-export-excel';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExcelExportColumns(props) {
   const membersData = props.membersData;
   return (
      <ExcelFile
         filename={`Miembros_${moment().format('l')}`}
         element={
            <Button style={{ marginLeft: 20 }} icon={<DownloadOutlined />}>
               Exportar
            </Button>
         }>
         <ExcelSheet data={membersData} name='Miembros'>
            <ExcelColumn label='Id' value='_id' />
            <ExcelColumn label='Id miembro' value='userid' />
            <ExcelColumn label='Id de la organización' value='organization_id' />
            <ExcelColumn label='Nombre' value={(data) => data.properties.name} />
            <ExcelColumn label='Compañia' value={(data) => data.properties.company} />
            <ExcelColumn label='Cargo o rol' value={(data) => data.properties.position} />
            <ExcelColumn label='País' value={(data) => data.properties.country} />
            <ExcelColumn label='Correo' value={(data) => data.properties.email} />
            <ExcelColumn label='Fecha creación' value='updated_at' />
            <ExcelColumn label='Fecha actualización' value='created_at' />
         </ExcelSheet>
      </ExcelFile>
   );
}

export default ExcelExportColumns;
