import { useState } from 'react';
import { FaqsApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';

const Faqs = (props) => {
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
      title: 'Contenido',
      dataIndex: 'content',
      ellipsis: true,
      sorter: (a, b) => a.content.localeCompare(b.content),
      ...getColumnSearchProps('content', columnsData),
      render(val, item) {
        return (
          <div style={{ maxHeight: '100px' }}>
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          </div>
        );
      },
    },
  ];

  return (
    <CMS
      API={FaqsApi}
      eventId={props.event._id}
      title={'Preguntas frecuentes'}
      titleTooltip={'Agregue o edite las Preguntas frecuentes que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/faq`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/faq`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  );
};

export default Faqs;
