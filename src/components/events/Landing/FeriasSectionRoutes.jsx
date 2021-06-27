import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
/** --------------------
 *  secciones del evento
 * ---------------------*/
 import FeriasDetail from '../../events/ferias/FeriasDetail';
 import FeriasList from '../../events/ferias/FeriasList';


const FeriasSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  console.log(props.cEvent)
  
  if (!props.cEvent) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <FeriasList event_id={props.cEvent._id} />
      </Route>
      <Route path={`${path}/:id/detailsCompany`}>
        <FeriasDetail eventId={props.cEvent._id}/>
      </Route>      
    </Switch>
  );
};
export default FeriasSectionRoutes;