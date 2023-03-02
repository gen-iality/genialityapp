import { useState } from 'react';
import { InvitationsApi } from '@helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import dayjs from 'dayjs';

const Report = (props) => {
  const [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'user_name_requesting',
      ellipsis: true,
      sorter: (a, b) => a.user_name_requesting.localeCompare(b.user_name_requesting),
      ...getColumnSearchProps('user_name_requesting', columnsData),
      render(val, item) {
        return (
          <div>
            {item.user_name_requesting ? item.user_name_requesting : 'Sin datos'}
          </div>
        )
      },
    },
    {
      title: 'Usuario quien responde',
      dataIndex: 'user_name_requested',
      ellipsis: true,
      sorter: (a, b) => a.user_name_requested?.localeCompare(b.user_name_requested),
      ...getColumnSearchProps('user_name_requested', columnsData),
      render(val, item) {
        return (
          <div>
            {item.user_name_requested ? item.user_name_requested : 'Sin datos'}
          </div>
          )
      },
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      ellipsis: true,
      sorter: (a, b) => a.state?.localeCompare(b.state),
      ...getColumnSearchProps('state', columnsData)
    },
    {
      title: 'Respuesta',
      dataIndex: 'response',
      ellipsis: true,
      sorter: (a, b) => a.response?.localeCompare(b.response),
      ...getColumnSearchProps('response', columnsData),
      render(val, item) {
        return (
          <div>
            {item.response ? item.response : 'Sin respuesta'}
          </div>
          )
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      ellipsis: true,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      ...getColumnSearchProps('created_at', columnsData),
      render(val, item) {
        return (
          <div>{dayjs(item.created_at).format('DD/MM/YYYY')}</div>
        )
      }
    },
  ];

  return (
    <CMS 
      API={InvitationsApi}
      eventId={props.event._id}
      title={'Reporte de Networking'}
      exportData
      columns={columns}
      key="_id"
      search
      setColumnsData={setColumnsData}
      fileName="Employees"
      scroll={{x: 'auto'}}
    />
  );
}

export default Report;
