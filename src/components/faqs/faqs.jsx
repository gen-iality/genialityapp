import { FaqsApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';

const Faqs = (props) => {
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      render(val, item) {
        return (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        )
      }
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
    />
  );
}

export default Faqs;
