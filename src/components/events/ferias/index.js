import { Card } from 'antd';
import React from 'react';
import FeriasSectionRoutes from '../Landing/FeriasSectionRoutes';
import FeriasDetail from './FeriasDetail';
import FeriasList from './FeriasList';

const Ferias = ({ event }) => {
  
// return <Card title='Ferias'>{viewFeriasDetail ? <FeriasDetail /> : <FeriasList event_id={eventId} stateferia={setviewFeriasDetail} /> }</Card>;
return <FeriasSectionRoutes cEvent={event} /> 
};

export default Ferias;
