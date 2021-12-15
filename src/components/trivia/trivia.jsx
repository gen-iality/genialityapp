import { useState } from 'react';
import { SurveysApi, AgendaApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import { SendOutlined } from '@ant-design/icons'

const trivia = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Nombre de la encuesta',
      dataIndex: 'survey',
      ellipsis: true,
      sorter: (a, b) => a.survey.localeCompare(b.survey),
      ...getColumnSearchProps('survey', columnsData)
    },
    {
      title: 'Publicada',
      dataIndex: 'publish',
      ellipsis: true,
      sorter: (a, b) => a.publish.localeCompare(b.publish),
      ...getColumnSearchProps('publish', columnsData),
      render(val, item) {
        return <p>{item.publish ? 'Cierto' : 'Falso'}</p>
      }
    },
  ];

  return (
    <CMS 
      API={SurveysApi}
      eventId={props.event._id}
      title={'Encuesta'}
      titleTooltip={'Agregue o edite las Agendas que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/encuesta`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/encuesta`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
      /* extraPath={`${props.matchUrl}/report`}
      extraPathIcon={<SendOutlined />}
      extraPathTitle='Detalle'
      extraPathId
      extraPathStateName={'report'}
      widthAction={130} */
    />
  );
}

export default trivia;
