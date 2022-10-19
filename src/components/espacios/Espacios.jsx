import { useState } from 'react';
import { SpacesApi } from '@helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import dayjs from 'dayjs';

const Espacios = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      ...getColumnSearchProps('created_at', columnsData),
      render(val, item) {
        return <div>{dayjs(item.created_at).format('DD/MM/YYYY')}</div>;
      },
    },
  ];

  return (
    <CMS
      API={SpacesApi}
      eventId={props.event._id}
      title={'Espacios'}
      titleTooltip={'Agregue o edite los Espacios que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/espacio`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/espacio`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
};

export default Espacios;
