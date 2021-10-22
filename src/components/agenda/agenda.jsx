import { useState } from 'react';
import { AgendaApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import {Tag} from 'antd'

const Agenda = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Fecha y Hora Inicio',
      dataIndex: 'datetime_start',
      render(record, key) {
        <p key={key}>{record}</p>
      },
      ...getColumnSearchProps('datetime_start', columnsData)
    },
    {
      title: 'Fecha y Hora Fin',
      dataIndex: 'datetime_end',
      render(record, key) {
        <p key={key}>{record}</p>
      },
      ...getColumnSearchProps('datetime_end', columnsData)
    },
    {
      title: 'Actividad',
      dataIndex: 'name',
      ...getColumnSearchProps('name', columnsData)
    },
    {
      title: 'Categorias',
      dataIndex: 'activity_categories',
      render(record) {
        record.map((item, key) => (
          <Tag key={key} color={item.color}>{item.name}</Tag>
        ))
      },
    },
    {
      title: 'Espacios',
      dataIndex: 'space',
      render(record) {
        record !== null && (
          <p>{record.name}</p>
        )
      },
    },
    {
      title: 'Conferencistas',
      dataIndex: 'hosts',
      render(record) {
        record.map((item, key) => (
          <p key={key}>{item.name}</p>
      ))
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
        pathname: `${props.matchUrl}/actividad`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/actividad`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
}

export default Agenda;
