import { useState } from 'react';
import { AgendaApi } from '@helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import { Tag } from 'antd';
import dayjs from 'dayjs';

import lessonTypeToString from '../events/lessonTypeToString';

const Agenda = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Fecha y hora inicio',
      dataIndex: 'datetime_start',
      ellipsis: true,
      sorter: (a, b) => a.datetime_start.localeCompare(b.datetime_start),
      ...getColumnSearchProps('datetime_start', columnsData),
      render(record, key) {
        return <div>{dayjs(record).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'Fecha y hora fin',
      dataIndex: 'datetime_end',
      ellipsis: true,
      sorter: (a, b) => a.datetime_end.localeCompare(b.datetime_end),
      ...getColumnSearchProps('datetime_end', columnsData),
      render(record, key) {
        return <div>{dayjs(record).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: 'Lección',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Tipo',
      render(record, key) {
        if (record.type === null) {
          return <div>Genérico</div>
        }
        let typeName = lessonTypeToString(record.type.name) || 'Genérico';
        return <div>{typeName}</div>
      }
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
            <div>{record?.name}</div>
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
      title={'Temas'}
      titleTooltip={'Agregue o edite las Agendas que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/actividad`,
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
