import { DocumentsApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';

const Documents = ( props ) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'title',
    }
  ];
  
  return (
    <CMS 
      API={DocumentsApi}
      eventId={props.event._id}
      title={'Documentos'}
      titleTooltip={'Agregue o edite los Documentos que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/document`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/document`}
      pagination={false}
      actions
      downloadFile
    />
  )
}

export default Documents;
