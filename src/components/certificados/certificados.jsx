import { useState } from 'react';
import { CertsApi, RolAttApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import moment from 'moment';

const Certificados = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData)
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      ellipsis: true,
      sorter: (a, b) => a.rol.name.localeCompare(b.rol.name),
      ...getColumnSearchProps('rol', columnsData),
      render(val, item) {
        return (
          <div>{item.rol && item.rol.name ? item.rol.name : 'Sin Rol'}</div>
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
          <div>{moment(item.created_at).format('YYYY-DD-MM')}</div>
        )
      },
    }
  ];

  return (
    <CMS 
      API={CertsApi}
      eventId={props.event._id}
      title={'Certificados'}
      titleTooltip={'Agregue o edite los Certificados que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/certificado`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/certificado`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
}

export default Certificados;
