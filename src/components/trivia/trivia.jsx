import { useState } from 'react';
import { SurveysApi, AgendaApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import {Tag} from 'antd'

const trivia = (props) => {
  let [columnsData, setColumnsData] = useState({});

  const columns = [
    {
      title: 'Nombre de la encuesta',
      dataIndex: 'survey',
    },
    {
      title: 'Publicada',
      dataIndex: 'publish',
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
    />
  );
}

export default trivia;
