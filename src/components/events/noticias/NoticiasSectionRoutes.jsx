import React from 'react';
import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
/** --------------------
 *  secciones del evento
 * ---------------------*/
 import NoticiasList from './NoticiasList';

 import {UseEventContext} from '../../../Context/eventContext'
import NoticiasDetailsConnect from './NoticiasDetails';

const NoticiasSectionRoutes = () => {
  let { path } = useRouteMatch();  
  let cEvent = UseEventContext();
  
  if (!cEvent.value) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <NoticiasList/>
      </Route>
      <Route path={`${path}/:id/detailsNoticia`}>
       <NoticiasDetailsConnect />
      </Route>      
    </Switch>
  );
};
export default withRouter(NoticiasSectionRoutes);