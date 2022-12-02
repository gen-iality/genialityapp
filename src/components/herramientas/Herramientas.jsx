import { useState } from 'react';
import { ToolsApi } from '@helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import dayjs from 'dayjs';

const Herramientas = (props) => {
  const [columnsData, setColumnsData] = useState({});

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
      API={ToolsApi}
      eventId={props.event._id}
      title={'Herramientas'}
      titleTooltip={'Agregue o edite las herramientas que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/herramienta`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/herramienta`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
};

export default Herramientas;
