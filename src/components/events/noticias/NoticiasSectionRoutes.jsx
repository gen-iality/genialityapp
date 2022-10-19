import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
/** --------------------
 *  secciones del curso
 * ---------------------*/
import NoticiasList from './NoticiasList';

import { useEventContext } from '@context/eventContext';
import NoticiasDetailsConnect from './NoticiasDetails';

const NoticiasSectionRoutes = () => {
  let { path } = useRouteMatch();
  let cEvent = useEventContext();

  if (!cEvent.value) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <NoticiasList />
      </Route>
      <Route path={`${path}/:id/detailsNoticia`}>
        <NoticiasDetailsConnect />
      </Route>
    </Switch>
  );
};
export default withRouter(NoticiasSectionRoutes);
