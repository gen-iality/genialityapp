import { useState } from 'react';
import { AgendaApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import { Tag } from 'antd';
import moment from 'moment';

const Agenda = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Fecha y Hora Inicio',
      dataIndex: 'datetime_start',
      ellipsis: true,
      sorter: (a, b) => a.datetime_start.localeCompare(b.datetime_start),
      ...getColumnSearchProps('datetime_start', columnsData),
      render(record, key) {
        return <div>{moment(record).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'Fecha y Hora Fin',
      dataIndex: 'datetime_end',
      ellipsis: true,
      sorter: (a, b) => a.datetime_end.localeCompare(b.datetime_end),
      ...getColumnSearchProps('datetime_end', columnsData),
      render(record, key) {
        return <div>{moment(record).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'Actividad',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Categorias',
      dataIndex: 'activity_categories',
      ellipsis: true,
      render(record) {
        return (
          <>
            {record.map((item, key) => (
              <Tag key={key} color={item.color}>
                {item.name}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: 'Espacios',
      dataIndex: 'space',
      ellipsis: true,
      render(record) {
        return (
          <>
            <p>{record?.name}</p>
          </>
        );
      },
    },
    {
      title: 'Conferencistas',
      dataIndex: 'hosts',
      ellipsis: true,
      render(record) {
        return (
          <>
            {record.map((item, key) => (
              <Tag key={key}>{item.name}</Tag>
            ))}
          </>
        );
      },
    },
  ];

  return (
    <CMS
      API={AgendaApi}
      eventId={props.event._id}
      title={'Programación / Agenda'}
      titleTooltip={'Agregue o edite las Agendas que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/actividadv2`,
        state: { new: true },
      }}
      columns={columns}
      // key='_id'
      editPath={`${props.matchUrl}/actividad`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
      scroll={{ x: 'auto' }}
    />
  );
};

export default Agenda;
