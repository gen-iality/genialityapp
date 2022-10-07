import { useState } from 'react';
import { NewsFeed } from '@helpers/request';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';

const News = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title', columnsData),
    },
    {
      title: 'Fecha de Publicación',
      dataIndex: 'time',
      ellipsis: true,
      width: 210,
      sorter: (a, b) => a.time.localeCompare(b.time),
      ...getColumnSearchProps('time', columnsData),
      render(val, item) {
        return <div>{dayjs(item.time).format('YYYY-DD-MM')}</div>;
      },
    },
  ];

  return (
    <CMS
      API={NewsFeed}
      eventId={props.event._id}
      title={'Noticias'}
      titleTooltip={'Agregue o edite las Noticias que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.match.url}/new`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.match.url}/new`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
};

export default withRouter(News);
