import { NewsFeed } from '../../helpers/request';
import { withRouter } from 'react-router';
import moment from 'moment';
import CMS from '../newComponent/CMS';

const News = ( props ) => {
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
    },
    {
      title: 'Fecha de Publicación',
      dataIndex: 'time',
      render(val, item) {
        return (
          <div>
            {moment(item.time).format('YYYY-DD-MM')}
          </div>
        )
      }
    }
  ];
  
  return(
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
    />
  )
}

export default withRouter(News);
