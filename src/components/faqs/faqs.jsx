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
      ...getColumnSearchProps('title', columnsData)
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      render(val, item) {
        return (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        )
      },
      ...getColumnSearchProps('content', columnsData)
    }
  ];

  return (
    <CMS 
      API={FaqsApi}
      eventId={props.event._id}
      title={'Preguntas Frecuentes'}
      titleTooltip={'Agregue o edite las Preguntas Frecuentes que se muestran en la aplicación'}
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
}

export default Faqs;
