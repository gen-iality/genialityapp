import { Fragment, useState } from 'react';
import { eventTicketsApi } from '@helpers/request';
import dayjs from 'dayjs';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';

const Tickets = (props) => {
  let [columnsData, setColumnsData] = useState({});
  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      ellipsis: true,
      sorter: (a, b) => a._id.localeCompare(b._id),
      ...getColumnSearchProps('_id', columnsData),
    },
    {
      title: 'Nombre',
      dataIndex: 'title',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title', columnsData),
    },
    {
      title: 'Permiso de enviar respuesta',
      dataIndex: 'allowed_to_vote',
      ellipsis: true,
      ...getColumnSearchProps('allowed_to_vote', columnsData),
      render(val, item) {
        return <div>{item.allowed_to_vote ? 'Sí' : 'No'}</div>;
      },
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      ellipsis: true,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      ...getColumnSearchProps('created_at', columnsData),
      render(val, item) {
        return <div>{dayjs(item.created_at).format('DD/MM/YYYY')}</div>;
      },
    },
  ];

  return (
    <Fragment>
      <CMS
        API={eventTicketsApi}
        eventId={props.event._id}
        title={'Tickets'}
        titleTooltip={'Agregue o edite los Tickets que se muestran en la aplicación'}
        addUrl={{
          pathname: `${props.matchUrl}/ticket`,
          state: { new: true },
        }}
        columns={columns}
        key='_id'
        editPath={`${props.matchUrl}/ticket`}
        pagination={false}
        actions
        search
        setColumnsData={setColumnsData}
      />
    </Fragment>
  );
};

export default Tickets;
