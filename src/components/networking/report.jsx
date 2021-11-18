import { useState } from 'react';
import { InvitationsApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import moment from 'moment';

const Report = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'user_name_requesting',
      ...getColumnSearchProps('user_name_requesting', columnsData),
      render(val, item) {
        return (
          <div>
            {item.user_name_requesting ? item.user_name_requesting : 'Sin Datos'}
          </div>
        )
      },
    },
    {
      title: 'Usuario Quien responde',
      dataIndex: 'user_name_requested',
      ...getColumnSearchProps('user_name_requested', columnsData),
      render(val, item) {
        return (
          <div>
            {item.user_name_requested ? item.user_name_requested : 'Sin Datos'}
          </div>
          )
      },
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      ...getColumnSearchProps('state', columnsData)
    },
    {
      title: 'Respuesta',
      dataIndex: 'response',
      ...getColumnSearchProps('response', columnsData),
      render(val, item) {
        return (
          <div>
            {item.response ? item.response : 'Sin Respuesta'}
          </div>
          )
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      ...getColumnSearchProps('created_at', columnsData),
      render(val, item) {
        return (
          <div>{moment(item.created_at).format('DD/MM/YYYY')}</div>
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
      key='_id'
      search
      setColumnsData={setColumnsData}
      fileName={'Employees'}
    />
  );
}

export default Report;
